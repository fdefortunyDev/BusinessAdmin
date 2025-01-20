import { Injectable } from '@nestjs/common';
import { CreateGymDto } from './dtos/create-gym.dto';
import { GymsRepositoryService } from '../../repository/gyms/gyms.repository.service';
import { UpdateGymDto } from './dtos/update-gym.dto';
import { IGym } from '../../repository/gyms/dtos/in/gym.interface';

@Injectable()
export class GymsService {
  constructor(private readonly gymRepositoryService: GymsRepositoryService) {}

  async create(createGymDto: CreateGymDto) {
    const gymData: IGym = {
      name: createGymDto.name,
      address: createGymDto.address,
      email: createGymDto.email,
      phone: createGymDto.phone ?? '',
      website: createGymDto.website ?? '',
    };
    return this.gymRepositoryService.create(gymData);
  }

  async findAll() {
    return this.gymRepositoryService.findAll();
  }

  async findOne(id: string) {
    return this.gymRepositoryService.findOne(id);
  }

  async update(id: string, updateGymDto: UpdateGymDto) {
    const gymData: IGym = {
      name: updateGymDto.name ?? 'name',
      address: updateGymDto.address ?? 'address',
      email: updateGymDto.email ?? 'email',
      phone: updateGymDto.phone ?? '',
      website: updateGymDto.website ?? '',
    };
    return this.gymRepositoryService.update(id, gymData);
  }

  async remove(id: string) {
    return this.gymRepositoryService.remove(id);
  }
}
