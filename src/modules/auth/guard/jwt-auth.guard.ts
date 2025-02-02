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

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private client = jwksClient({
    jwksUri: process.env.JWKS_URI!,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access_token'];
    const idToken = request.cookies['id_token'];

    if (!accessToken || !idToken) {
      throw new UnauthorizedException('Access token or ID token is missing');
    }

    try {
      const decodedAccessToken = await this.verifyToken(accessToken);
      const decodedIdToken = jwt.decode(idToken);

      if (!decodedIdToken) {
        throw new UnauthorizedException('Invalid decoded token');
      }

      request.user = decodedAccessToken;
      const userPermissions: string[] =
        getPermissionsFromIdToken(decodedIdToken);

      const isSuperAdmin = userPermissions.some(
        (role) => role === Role.SuperAdmin,
      );

      if (isSuperAdmin) {
        return true;
      }

      return requiredRoles.some((role) => userPermissions.includes(role));
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async verifyToken(token: string): Promise<any> {
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid decoded token');
    }

    const kid = decodedToken.header.kid;
    const key = await this.client.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    return jwt.verify(token, signingKey);
  }
}

function getPermissionsFromIdToken(
  decodedIdToken: string | jwt.JwtPayload,
): string[] {
  return decodedIdToken['custom:permissions'].split(',');
}
