import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Role } from '../../../utils/role.enum';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private client = jwksClient({
    jwksUri: process.env.JWKS_URI!,
  });

  private httpService: HttpService = new HttpService(axios);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    let accessToken = request.cookies['access_token'];
    let idToken = request.cookies['id_token'];
    const refreshToken = request.cookies['refresh_token'];

    if (!accessToken || !idToken) {
      if (refreshToken) {
        const newTokens = await this.generateNewTokens(
          request,
          response,
          refreshToken,
        );
        accessToken = newTokens.access_token;
        idToken = newTokens.id_token;
      } else {
        throw new UnauthorizedException();
      }
    }

    try {
      const decodedAccessToken = await this.verifyToken(accessToken);
      request.user = decodedAccessToken;
    } catch (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        try {
          const tokens = await this.generateNewTokens(
            request,
            response,
            refreshToken,
          );
          accessToken = tokens.access_token;
          idToken = tokens.id_token;
        } catch (error) {
          console.error(error);
          return false;
        }
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }

    const decodedIdToken = jwt.decode(idToken);

    if (!decodedIdToken) {
      throw new UnauthorizedException('Invalid decoded id_token');
    }

    const userPermissions: string[] = getPermissionsFromIdToken(decodedIdToken);

    const isSuperAdmin = userPermissions.some(
      (role) => role === Role.SuperAdmin,
    );

    if (isSuperAdmin) {
      return true;
    }

    return requiredRoles.some((role) => userPermissions.includes(role));
  }

  private async generateNewTokens(
    request: Request,
    response: Response,
    refreshToken: any,
  ): Promise<Record<string, string>> {
    try {
      const tokens = await this.refreshToken(refreshToken);
      const decodedAccessToken = await this.verifyToken(tokens.access_token);
      request.user = decodedAccessToken;

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION!),
      });

      response.cookie('id_token', tokens.id_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: parseInt(process.env.ID_TOKEN_EXPIRATION!),
      });

      return tokens;
    } catch (refreshErr) {
      console.error('Error refreshing token', refreshErr.message);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async verifyToken(token: string): Promise<string | jwt.JwtPayload> {
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid decoded token');
    }

    const kid = decodedToken.header.kid;
    const key = await this.client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    return jwt.verify(token, signingKey);
  }

  private async refreshToken(
    refreshToken: string,
  ): Promise<Record<string, any>> {
    const response = await this.httpService.axiosRef.post(
      process.env.TOKEN_URL!,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.COGNITO_CLIENT_ID!,
        refresh_token: refreshToken,
        client_secret: process.env.COGNITO_CLIENT_SECRET!,
        redirect_uri: process.env.REDIRECT_AUTH_URL!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  }
}

function getPermissionsFromIdToken(
  decodedIdToken: string | jwt.JwtPayload,
): string[] {
  return decodedIdToken['custom:permissions'].split(',') || [];
}
