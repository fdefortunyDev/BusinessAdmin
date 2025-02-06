import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (data) {
          const response: Response = context.switchToHttp().getResponse();
          const isProduction =
            this.configService.getOrThrow('NODE_ENV') === 'production';

          if (data.accessToken) {
            response.cookie('access_token', data.accessToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'strict',
              maxAge: parseInt(
                this.configService.getOrThrow('ACCESS_TOKEN_EXPIRATION'),
              ),
            });
          }

          if (data.idToken) {
            response.cookie('id_token', data.idToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'strict',
              maxAge: parseInt(
                this.configService.getOrThrow('ID_TOKEN_EXPIRATION'),
              ),
            });
          }

          if (data.refreshToken) {
            response.cookie('refresh_token', data.refreshToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: 'strict',
              maxAge: parseInt(
                this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION'),
              ),
            });
          }
        }
      }),
    );
  }
}
