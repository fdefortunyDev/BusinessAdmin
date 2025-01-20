import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import {
  getPermissionsAccesses,
  getRolesAndPermissions,
} from '../../utils/auth';
import { Role } from '../../utils/enums/role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const jwtValidate = await super.canActivate(context);

    if (!jwtValidate) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { user, headers }: { user; headers: IncomingHttpHeaders } =
      request || {};

    if (!user || !user?.permissions?.length) {
      return false;
    }

    const allPermissions = getRolesAndPermissions(getPermissionsAccesses(user));

    return requiredRoles.some((role) =>
      allPermissions.find((permission) => permission.role === role),
    );
  }
}
