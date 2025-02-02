import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req, res, next: () => void): void {
    passport.authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/error' },
      (err, user) => {
        if (err || !user) {
          throw new UnauthorizedException();
        }
        next();
      },
    )(req, res, next);
  }
}
