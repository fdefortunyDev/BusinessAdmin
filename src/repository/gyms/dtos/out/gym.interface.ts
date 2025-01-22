export interface IGym {
  id: number;
  name: string;
  address: string;
  email: string;
  phone?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
