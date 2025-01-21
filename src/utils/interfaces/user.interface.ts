export interface IUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: string;
  accesses: string[];
}
