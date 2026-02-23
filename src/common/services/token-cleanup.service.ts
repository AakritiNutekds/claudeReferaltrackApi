import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Scheduled job to purge expired refresh tokens and JWT revocations.
 * Runs daily at 2 AM to keep those tables from growing unbounded.
 */
@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 2 * * *')
  async purgeExpiredTokens() {
    const now = new Date();
    const [revocations, refreshTokens] = await Promise.all([
      this.prisma.tokenRevocation.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
      this.prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: now } },
      }),
    ]);
    this.logger.log(
      `Token cleanup: removed ${revocations.count} expired revocations, ${refreshTokens.count} expired refresh tokens`,
    );
  }
}
