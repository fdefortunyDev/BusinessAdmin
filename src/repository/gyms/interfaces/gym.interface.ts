import { PartialType } from '@nestjs/swagger';
import { User } from '../../users/entity/users.entity';

export interface IGym extends GymDataToCreate {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class GymDataToCreate {
  name: string;
  address: string;
  email: string;
  phone?: string;
  website?: string;
  user: User;
}

export class GymDataToUpdate extends PartialType(GymDataToCreate) {}
