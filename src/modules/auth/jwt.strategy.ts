import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserAuth } from '../../utils/interfaces/user-auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        if (!req) return null;

        if (req.cookies && req.cookies.access_token) {
          return req.cookies.access_token;
        }

        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.getOrThrow('JWKS_URI'),
      }),
    });
  }

  async validate(payload): Promise<IUserAuth> {
    //TODO: modificar interface
    const requestUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      lastName: payload.lastName,
      permissions: payload.permissions,
    };
    console.log({ payload });

    console.log({ requestUser });
    return requestUser;
  }
}
