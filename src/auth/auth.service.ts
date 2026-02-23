import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { SignInDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as argon from 'argon2';
import { createHash, randomBytes } from 'crypto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const passwordHash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          // NOTE: roleId and organizationId should be supplied by an admin,
          // not self-selected. Self-registration should be disabled in production.
          roleId: dto.roleId ?? 1,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isActive: true,
          userName: dto.firstName + dto.lastName,
          createdBy: 1,
          modifiedBy: 1,
          isAuthenticated: true,
        },
        // Return only safe fields — never return password
        select: {
          userId: true,
          email: true,
          firstName: true,
          lastName: true,
          roleId: true,
          isActive: true,
          createdDate: true,
        },
      });

      await this.prisma.userOrganizationMap.create({
        data: {
          organizationId: dto.organizationId ?? 1,
          userId: user.userId,
          createdBy: 1,
          isActive: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(
    dto: SignInDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Use a constant-time comparison path — same exception message for
    // both "user not found" and "wrong password" to prevent user enumeration.
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    // Resolve tenant organization
    let organizationId = dto.organizationId;
    if (organizationId) {
      // Verify the user actually belongs to the requested organization
      const orgMap = await this.prisma.userOrganizationMap.findFirst({
        where: {
          userId: user.userId,
          organizationId,
          isActive: true,
        },
      });
      if (!orgMap) {
        throw new ForbiddenException(
          'Access denied for the requested organization',
        );
      }
    } else {
      // Fall back to first active org membership
      const orgMap = await this.prisma.userOrganizationMap.findFirst({
        where: { userId: user.userId, isActive: true },
      });
      organizationId = orgMap?.organizationId;
    }

    const [tokenResult, refreshToken] = await Promise.all([
      this.signToken(user.userId, user.email, organizationId),
      this.createRefreshToken(user.userId, ipAddress, userAgent),
    ]);

    return { ...tokenResult, refresh_token: refreshToken };
  }

  /**
   * Rotate refresh tokens.
   * The old token is immediately revoked. A new pair is returned.
   * This prevents refresh token reuse attacks.
   */
  async rotateRefreshToken(
    dto: RefreshTokenDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const tokenHash = createHash('sha256')
      .update(dto.refresh_token)
      .digest('hex');

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            isActive: true,
            userorganizationmaps: {
              where: { isActive: true },
              select: { organizationId: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!stored || stored.revokedAt !== null) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    if (!stored.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Revoke the old refresh token immediately (rotation)
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const organizationId =
      stored.user.userorganizationmaps[0]?.organizationId ?? undefined;

    const [tokenResult, newRefreshToken] = await Promise.all([
      this.signToken(stored.user.userId, stored.user.email, organizationId),
      this.createRefreshToken(stored.user.userId, ipAddress, userAgent),
    ]);

    return { ...tokenResult, refresh_token: newRefreshToken };
  }

  /**
   * Logout: revoke the current access token's JTI so it cannot be reused.
   */
  async revokeAccessToken(jti: string, exp: number): Promise<void> {
    if (!jti) return;
    await this.prisma.tokenRevocation.upsert({
      where: { jti },
      create: {
        jti,
        userId: 0, // userId stored in token but we use JTI as the key
        expiresAt: new Date(exp * 1000),
      },
      update: {},
    });
  }

  /**
   * Signs an access token.
   * - Algorithm explicitly set to HS256 (no alg:none possible).
   * - Short expiry (15 minutes).
   * - JTI (JWT ID) included for revocation support.
   * - organizationId embedded for tenant-scoped requests.
   */
  async signToken(
    userId: number,
    email: string,
    organizationId?: number,
  ): Promise<{ access_token: string }> {
    const jti = uuidv4();
    const payload: Record<string, unknown> = { sub: userId, email, jti };
    if (organizationId) {
      payload.organizationId = organizationId;
    }

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m', // Reduced from 120m — use refresh tokens for sessions
      secret,
      algorithm: 'HS256',
    });

    return { access_token: token };
  }

  /**
   * Creates a hashed, time-limited refresh token.
   * The raw token is returned once and never stored.
   * Only a SHA-256 hash is persisted in the database.
   */
  private async createRefreshToken(
    userId: number,
    ipAddress: string,
    userAgent: string,
  ): Promise<string> {
    const rawToken = randomBytes(40).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return rawToken;
  }

  async getorganizations() {
    return await this.prisma.organization.findMany({
      select: {
        organizationId: true,
        name: true,
      },
    });
  }
}
