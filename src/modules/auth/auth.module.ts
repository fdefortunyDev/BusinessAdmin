import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './apikey.strategy';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [ApiKeyStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {}
}
