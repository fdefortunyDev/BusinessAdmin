import { IMembership } from '../../../memberships/dtos/out/membership-response.dto';
import { IUser } from '../../../users/dtos/out/user-response.dto';

export interface IBusiness {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  user: IUser;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberships: IMembership[];
}
