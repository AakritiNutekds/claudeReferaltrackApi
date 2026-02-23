import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    // Secret and algorithm are set per-call in signAsync() with explicit options.
    // Leaving the module-level secret empty is intentional — all signing goes
    // through AuthService.signToken() which enforces HS256 and short expiry.
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
