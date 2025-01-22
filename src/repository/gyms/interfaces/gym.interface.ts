export interface Gym extends GymDataToCreate {
  id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GymDataToCreate {
  name: string;
  address: string;
  email: string;
  phone?: string;
  website?: string;
}

export interface GymDataToUpdate {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
}
