import { IBusiness } from '../../../business/dtos/out/business-response.dto';
import { UserDataToCreate } from '../in/user-data-to-create.dto';

export interface IUser extends UserDataToCreate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  business: IBusiness[];
}
