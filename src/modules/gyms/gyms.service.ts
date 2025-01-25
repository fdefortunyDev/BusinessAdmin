import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateGymDto } from './dtos/create-gym.dto';
import { GymsRepositoryService } from '../../repository/gyms/gyms.repository.service';
import { UpdateGymDto } from './dtos/update-gym.dto';
import { GymsError } from '../../utils/errors/gyms-error.enum';
import { IGym } from '../../repository/gyms/interfaces/gym.interface';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { UsersError } from '../../utils/errors/users-error.enum';
import { IUser } from '../../repository/users/interfaces/user.interface';
import { IGymResponse } from './dtos/gym-response.dto';

@Injectable()
export class GymsService {
  constructor(
    private readonly gymRepositoryService: GymsRepositoryService,
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}

  async create(createGymDto: CreateGymDto): Promise<IGym> {
    const { name, address, email, phone, website, userId } = createGymDto;
    const gymExists = await this.gymRepositoryService.findOneByName(name);

    if (gymExists) {
      throw new ConflictException(GymsError.alreadyExists);
    }

    const user: IUser | null =
      await this.usersRepositoryService.findOneById(userId);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const createdGym: IGym = await this.gymRepositoryService.create({
      name,
      address,
      email,
      phone,
      website,
      user,
    });

    if (!createdGym) {
      throw new ServiceUnavailableException(GymsError.notCreated);
    }

    return createdGym;
  }

  async findAll(): Promise<IGymResponse[]> {
    return await this.gymRepositoryService.findAll();
  }

  async findOne(id: string): Promise<IGym | null> {
    const gym = await this.gymRepositoryService.findOneById(id);

    if (!gym) {
      throw new NotFoundException(GymsError.notFound);
    }

    return gym;
  }

  async update(id: string, updateGymDto: UpdateGymDto) {
    const gymToUpdate: IGym | null =
      await this.gymRepositoryService.findOneById(id);

    if (!gymToUpdate) {
      return null;
    }

    gymToUpdate.name = updateGymDto.name ?? gymToUpdate.name;
    gymToUpdate.address = updateGymDto.address ?? gymToUpdate.address;
    gymToUpdate.email = updateGymDto.email ?? gymToUpdate.email;
    gymToUpdate.phone = updateGymDto.phone ?? gymToUpdate.phone;
    gymToUpdate.website = updateGymDto.website ?? gymToUpdate.website;

    const updatedGym: IGym | null =
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
