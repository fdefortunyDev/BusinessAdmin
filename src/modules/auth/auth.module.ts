import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './apikey.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, HttpModule],
  controllers: [AuthController],
  providers: [ApiKeyStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
