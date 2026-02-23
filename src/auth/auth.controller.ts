import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { SignInDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtGuard } from './guard';
import { GetUser } from './decorator';
import { Request } from 'express';

// ── REMOVED ENDPOINTS (security reasons) ──────────────────────────────────────
//
// GET  /auth                         — returned ALL orgs unauthenticated (tenant enum)
// GET  /auth/:email                  — user enumeration, unauthenticated
// GET  /auth/refreshToken/:token     — token in URL → written to every access log
// GET  /auth/isTokenExpired/:token   — token in URL → written to every access log
// GET  /auth/getTokenForUserIdAndSecertCode  — BACKDOOR with hardcoded secret: REMOVED
// POST /auth/signinForResourceId     — AUTHENTICATION BYPASS (no password): REMOVED
//
// ─────────────────────────────────────────────────────────────────────────────

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  /**
   * Sign in — returns short-lived access token (15 min) + opaque refresh token (7 days).
   * Rate limited to 5 attempts per minute per IP to prevent brute force.
   */
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto, @Req() req: Request) {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.ip ??
      '';
    const userAgent = req.headers['user-agent'] ?? '';
    return this.authService.signin(dto, ipAddress, userAgent);
  }

  /**
   * Refresh — rotate refresh token, issue new access token.
   * The consumed refresh token is revoked immediately on use.
   * Token transmitted in request body, never in URL.
   */
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.ip ??
      '';
    const userAgent = req.headers['user-agent'] ?? '';
    return this.authService.rotateRefreshToken(dto, ipAddress, userAgent);
  }

  /**
   * Logout — revokes the JTI of the current access token so it cannot be
   * reused even within its remaining 15-minute window.
   */
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@GetUser() user: { jti: string; tokenExp: number }) {
    return this.authService.revokeAccessToken(user.jti, user.tokenExp);
  }
}
