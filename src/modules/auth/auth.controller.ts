import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthError } from '../../utils/errors/auth-error.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('callback')
  async handleAuthCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException(AuthError.codeNotFound);
    }
    const isProduction =
      this.configService.getOrThrow('NODE_ENV') === 'production';
    try {
      const { access_token, id_token, refresh_token } =
        await this.authService.callback(code);

      const response = this.setCookies(
        res,
        access_token,
        id_token,
        refresh_token,
        isProduction,
      );

      return this.redirectToApp(response);
    } catch (error) {
      console.error(
        AuthError.tokenExchangeFailed,
        error.response?.data || error,
      );
      throw new InternalServerErrorException(AuthError.tokenExchangeFailed);
    }
  }

  private setCookies(
    res: Response,
    access_token: any,
    id_token: any,
    refresh_token: any,
    isProduction: boolean,
  ): Response {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: parseInt(
        this.configService.getOrThrow('ACCESS_TOKEN_EXPIRATION'),
      ),
    });

    res.cookie('id_token', id_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: parseInt(this.configService.getOrThrow('ID_TOKEN_EXPIRATION')),
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: parseInt(
        this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION'),
      ),
    });

    return res;
  }

  private redirectToApp(res: Response): void {
    res.redirect(this.configService.getOrThrow('CLIENT_URL'));
  }
}
