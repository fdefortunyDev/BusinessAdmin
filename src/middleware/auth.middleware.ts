import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as passport from 'passport';
import { GeneralError } from '../utils/errors/general-error.enum';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req, res, next: () => void): void {
    passport.authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/error' },
      (err, user) => {
        if (err || !user) {
          if (req.url === '/docs') {
            return next(); // Permitir acceso sin autenticación para esta ruta
          }
          throw new UnauthorizedException(GeneralError.invalidApikey);
        }
        req.user = user; // Adjuntar el usuario validado a la solicitud
        next();
      },
    )(req, res, next);
  }
}
