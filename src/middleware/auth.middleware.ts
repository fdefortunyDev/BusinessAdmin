import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    passport.authenticate(
      'headerapikey',
      { session: false, failureRedirect: '/error' },
      (err, user, info) => {
        if (err || !user) {
          if (req.url === '/health' || req.url === '/docs') {
            return next(); // Permitir acceso sin autenticación para estas rutas
          }

          res.status(401).json({
            statusCode: 401,
            message: info?.message || 'Unauthorized',
          });
        }
        req.user = user; // Adjuntar el usuario validado a la solicitud
        next();
      },
    )(req, res, next);
  }
}
