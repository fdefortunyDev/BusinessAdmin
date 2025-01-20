import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './apikey.strategy';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule],
  providers: [ApiKeyStrategy, AuthService, JwtService, JwtAuthGuard, ConfigService],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
