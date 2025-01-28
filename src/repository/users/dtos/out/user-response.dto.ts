import { IGym } from '../../../gyms/dtos/out/gym-response.dto';
import { UserDataToCreate } from '../in/user-data-to-create.dto';

export interface IUser extends UserDataToCreate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  gyms: IGym[];
}
