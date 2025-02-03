import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './apikey.strategy';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [ApiKeyStrategy, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {}
}
