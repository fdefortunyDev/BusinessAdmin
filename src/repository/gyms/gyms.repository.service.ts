import { Injectable } from '@nestjs/common';
import { IGym } from './dtos/in/gym.interface';
import { IGymResponse } from './dtos/out/gym-response.interface';

@Injectable()
export class GymsRepositoryService {
  constructor() {}

  async create(gymData: IGym): Promise<IGymResponse> {
    const { name, address, email, phone, website } = gymData;
    const gym: IGymResponse = {
      id: '1',
      name,
      address,
      email,
      phone: phone ? phone : '123',
      website: website ? website : 'www.smartgym.com.uy',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return gym;
  }

  async findAll(): Promise<IGymResponse[]> {
    const gyms: IGymResponse[] = [
      {
        id: '1',
        name: 'SmartGym',
        address: 'Ruta 8 esq cochabamba',
        email: 'example@gmail.com',
        phone: '12345678',
        website: 'www.smartgym.com.uy',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    return gyms;
  }

  async findOne(id: string): Promise<IGymResponse> {
    const gym: IGymResponse = {
      id,
      name: 'SmartGym',
      address: 'Ruta 8 esq cochabamba',
      email: 'example@gmail.com',
      phone: '12345678',
      website: 'www.smartgym.com.uy',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return gym;
  }

  async update(id: string, gymData: IGym): Promise<IGymResponse> {
    const updatedGym: IGymResponse = {
      id,
      name: gymData.name,
      address: gymData.address,
      email: gymData.email,
      phone: '12345678',
      website: 'www.smartgym.com.uy',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return updatedGym;
  }

  async remove(id: string): Promise<IGymResponse> {
    const removedGym: IGymResponse = {
      id,
      name: 'SmartGym',
      address: 'Ruta 8 esq cochabamba',
      email: 'example@gmail.com',
      phone: '12345678',
      is_active: false,
      website: 'www.smartgym.com.uy',
      created_at: new Date(),
      updated_at: new Date(),
    };

    return removedGym;
  }
}
