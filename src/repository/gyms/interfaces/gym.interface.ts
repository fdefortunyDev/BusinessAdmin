import { User } from '../../users/entity/users.entity';

export interface IGym {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  user: User;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
