import { ConfigService } from '@nestjs/config';
import { IPermission, IUserAuth } from './interfaces/user-auth.interface';

export const isRoleAdmin = (user: IUserAuth): boolean => {
  const accesses = getPermissionsAccesses(user);
  const rolesXPermissions = getRolesAndPermissions(accesses);

  return rolesXPermissions.length > 0;
};

export const getRolesAndPermissions = (
  accesses: string[],
): Record<any, any>[] => {
  return accesses.map((access) => {
    const role = access.length > 1 ? access[1] : '';
    return {
      role,
    };
  });
};

export const getPermissionsAccesses = (user: IUserAuth): string[] => {
  const config = new ConfigService();
  const accessesPermission =
    user.permissions.find(
      (permission: IPermission) =>
        permission.id === config.get('ACCESS_PERMISSION_ID'),
    ) || user.permissions[0];
  return accessesPermission.accesses;
};
