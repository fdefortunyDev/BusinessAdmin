import { IUser } from '../../../users/dtos/out/user-response.dto';

export class BusinessDataToCreate {
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  user: IUser;
}
