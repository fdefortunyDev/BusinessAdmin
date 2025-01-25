import { IGym } from '../../gyms/interfaces/gym.interface';

export interface IUser {
  id: string;
  cognitoUserId: string;
  firstName: string;
  lastName: string;
  document: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  gyms: IGym[];
}
