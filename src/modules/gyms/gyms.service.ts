import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateGymDto } from './dtos/in/create-gym.dto';
import { GymsRepositoryService } from '../../repository/gyms/gyms.repository.service';
import { UpdateGymDto } from './dtos/in/update-gym.dto';
import { GymsError } from '../../utils/errors/gyms-error.enum';
import { IGym } from '../../repository/gyms/dtos/out/gym.interface';

@Injectable()
export class GymsService {
  constructor(private readonly gymRepositoryService: GymsRepositoryService) {}

  async create(createGymDto: CreateGymDto) {
    const createdGym: IGym = await this.gymRepositoryService.create({
      name: createGymDto.name,
      address: createGymDto.address,
      email: createGymDto.email,
      phone: createGymDto.phone ?? '',
      website: createGymDto.website ?? '',
    });

    if(!createdGym) {
      throw new ServiceUnavailableException(GymsError.notCreated);
    }

    return createdGym;
  }

  async findAll() {
    return await this.gymRepositoryService.findAll();
  }

  async findOne(id: string) {
    return await this.gymRepositoryService.findOneById(id);
  }

  async update(id: string, updateGymDto: UpdateGymDto) {
    const updatedGym: IGym = await this.gymRepositoryService.update(id, {
      name: updateGymDto.name ?? 'name',
      address: updateGymDto.address ?? 'address',
      email: updateGymDto.email ?? 'email',
      phone: updateGymDto.phone ?? '',
      website: updateGymDto.website ?? '',
    });

    if(!updatedGym) {
      throw new ServiceUnavailableException(GymsError.notUpdated);
    }

    return updatedGym;
  }

  async remove(id: string) {
    return await this.gymRepositoryService.remove(id);
  }
}
