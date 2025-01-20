import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private authService: AuthService) {
    super({ header: 'apikey', prefix: '' }, false);
  }

  validate(apikey: string): boolean {
    const isValid = this.authService.validateApiKey(apikey);
    if (!isValid) {
      return false;
    }
    return true;
  }
}
