import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateGymDto } from './dtos/create-gym.dto';
import { GymsRepositoryService } from '../../repository/gyms/gyms.repository.service';
import { UpdateGymDto } from './dtos/update-gym.dto';
import { GymsError } from '../../utils/errors/gyms-error.enum';
import { Gym } from '../../repository/gyms/interfaces/gym.interface';

@Injectable()
export class GymsService {
  constructor(private readonly gymRepositoryService: GymsRepositoryService) {}

  async create(createGymDto: CreateGymDto): Promise<Gym> {
    const createdGym: Gym = await this.gymRepositoryService.create({
      name: createGymDto.name,
      address: createGymDto.address,
      email: createGymDto.email,
      phone: createGymDto.phone ?? '',
      website: createGymDto.website ?? '',
    });

    if (!createdGym) {
      throw new ServiceUnavailableException(GymsError.notCreated);
    }

    return createdGym;
  }

  async findAll(): Promise<Gym[]> {
    return await this.gymRepositoryService.findAll();
  }

  async findOne(id: string): Promise<Gym | null> {
    const gym = await this.gymRepositoryService.findOneById(id);

    if (!gym) {
      throw new NotFoundException(GymsError.notFound);
    }

    return gym;
  }

  async update(id: string, updateGymDto: UpdateGymDto) {
    const gymToUpdate: Gym | null =
      await this.gymRepositoryService.findOneById(id);

    if (!gymToUpdate) {
      return null;
    }

    gymToUpdate.name = updateGymDto.name ?? gymToUpdate.name;
    gymToUpdate.address = updateGymDto.address ?? gymToUpdate.address;
    gymToUpdate.email = updateGymDto.email ?? gymToUpdate.email;
    gymToUpdate.phone = updateGymDto.phone ?? gymToUpdate.phone;
    gymToUpdate.website = updateGymDto.website ?? gymToUpdate.website;

    const updatedGym: Gym | null =
      await this.gymRepositoryService.updateOne(gymToUpdate);

    if (!updatedGym) {
      throw new ServiceUnavailableException(GymsError.notUpdated);
    }

    return updatedGym;
  }

  async remove(id: string): Promise<boolean> {
    return await this.gymRepositoryService.remove(id);
  }
}
