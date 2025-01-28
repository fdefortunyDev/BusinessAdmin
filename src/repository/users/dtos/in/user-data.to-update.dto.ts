import { UserDataToCreate } from './user-data-to-create.dto';

export interface UserDataToUpdate extends Partial<UserDataToCreate> {}
