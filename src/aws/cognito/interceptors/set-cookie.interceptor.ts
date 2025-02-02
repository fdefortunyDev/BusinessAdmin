import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (data) {
          const response = context.switchToHttp().getResponse();
          const isProduction =
            this.configService.getOrThrow('NODE_ENV') === 'production';

          if (data.accessToken) {
            response.cookie('access_token', data.accessToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'strict',
              maxAge: 3600000, // 1 hora
            });
          }
          if (data.idToken) {
            response.cookie('id_token', data.idToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'strict',
              maxAge: 3600000, // 1 hora
            });
          }
          if (data.refreshToken) {
            response.cookie('refresh_token', data.refreshToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'strict',
              maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
            });
          }
        }
      }),
    );
  }
}
