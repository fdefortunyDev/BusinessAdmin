import { IUser } from '../../../users/interfaces/user.interface';

export class GymDataToCreate {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  user: IUser;
}
