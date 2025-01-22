import { Injectable, NotFoundException } from '@nestjs/common';
import { IGym } from './dtos/out/gym.interface';
import { GymDataToCreate } from './dtos/in/create-gym.interface';
import { GymDataToUpdate } from './dtos/in/update-gym.interface';
import { GymsError } from '../../utils/errors/gyms-error.enum';

@Injectable()
export class GymsRepositoryService {
  constructor() {}

  async create(gymData: GymDataToCreate): Promise<IGym> {
    const { name, address, email, phone, website } = gymData;
    const gymToCreate: IGym = {
      id: 1,
      name,
      address,
      email,
      phone: phone ?? '',
      website: website ?? '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return gymToCreate;
  }

  async findAll(): Promise<IGym[]> {
    const gyms: IGym[] = [
      {
        id: 1,
        name: 'SmartGym-example',
        address: 'Ruta 8 esq cochabamba',
        email: 'example@gmail.com',
        phone: '12345678',
        website: 'www.smartgym.com.uy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    return gyms;
  }

  async findOneById(id: string): Promise<IGym> {
    const gym: IGym = {
      id: parseInt(id),
      name: 'SmartGym-example',
      address: 'Ruta 8 esq cochabamba',
      email: 'example@gmail.com',
      phone: '12345678',
      website: 'www.smartgym.com.uy',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return gym;
  }

  async update(id: string, gymData: GymDataToUpdate): Promise<IGym> {
    const { name, address, email, phone, website } = gymData;

    const gymToUpdate: IGym = await this.findOneById(id);

    if (!gymToUpdate) {
      throw new NotFoundException(GymsError.notFound);
    }

    //actualizar....

    return gymToUpdate;
  }

  async remove(id: string): Promise<IGym> {
    const removedGym: IGym = {
      id: parseInt(id),
      name: 'SmartGym-example',
      address: 'Ruta 8 esq cochabamba',
      email: 'example@gmail.com',
      phone: '12345678',
      isActive: false,
      website: 'www.smartgym.com.uy',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return removedGym;
  }
}
