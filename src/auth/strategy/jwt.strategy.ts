import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      // SECURITY: Whitelist only HS256.
      // Prevents alg:none attacks and algorithm confusion attacks.
      algorithms: ['HS256'],
      // ignoreExpiration is intentionally NOT set — expired tokens are rejected.
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    jti?: string;
    organizationId?: number;
    exp: number;
  }) {
    // SECURITY: Check token revocation (JTI blacklist).
    // Required for logout and refresh rotation to take effect immediately.
    if (payload.jti) {
      const revoked = await this.prisma.tokenRevocation.findUnique({
        where: { jti: payload.jti },
      });
      if (revoked) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    // SECURITY: Select only the fields needed downstream.
    // Password, recoveryCode, tempToken are never returned.
    const user = await this.prisma.user.findUnique({
      where: { userId: payload.sub },
      select: {
        userId: true,
        roleId: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        role: {
          select: {
            roleName: true,
            canManageUsers: true,
            canUpdateMasters: true,
            canManageDataEntry: true,
            canManagePatientEntry: true,
            canDelete: true,
          },
        },
      },
    });

    // SECURITY: Reject deactivated users immediately.
    // Without this, a terminated employee's token remains valid until expiry.
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account is deactivated or not found');
    }

    return {
      ...user,
      organizationId: payload.organizationId ?? null,
      jti: payload.jti ?? null,
      tokenExp: payload.exp,
    };
  }
}
