import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.getOrThrow('JWKS_URI'),
      }),
    });
  }

  async validate(payload: any) {
    const user = JSON.parse(payload.user);
    const { permissions } = JSON.parse(payload.permissions);
    const requestUser = {
      id: payload.sub,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      permissions,
    };
    return requestUser;
  }
}
