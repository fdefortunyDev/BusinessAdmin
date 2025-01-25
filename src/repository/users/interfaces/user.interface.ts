import { IGym } from '../../gyms/interfaces/gym.interface';

export interface IUser extends UserDataToCreate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  gyms: IGym[];
}

export interface UserDataToCreate {
  cognitoId: string;
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  phone: string;
}

export interface UserDataToUpdate extends Partial<UserDataToCreate> {}
