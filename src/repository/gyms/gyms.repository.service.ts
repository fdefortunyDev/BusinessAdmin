import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Gym, GymDataToCreate } from './interfaces/gym.interface';
import { GymsError } from '../../utils/errors/gyms-error.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Gyms } from './entities/gyms.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class GymsRepositoryService {
  constructor(
    @InjectRepository(Gyms)
    private readonly gymsRepository: Repository<Gyms>,
  ) {}

  async create(gymData: GymDataToCreate): Promise<any> {
    const gymExists = await this.findOneByName(gymData.name);

    if (gymExists) {
      throw new ConflictException(GymsError.alreadyExists);
    }

    const gymToCreate = this.gymsRepository.create({
      name: gymData.name,
      address: gymData.address,
      email: gymData.email,
      phone: gymData.phone ?? '',
      website: gymData.website ?? '',
      isActive: true,
    });

    const createdGym = await this.gymsRepository.save(gymToCreate);

    if (!createdGym) {
      throw new NotFoundException(GymsError.notCreated);
    }

    return createdGym;
  }

  async findAll(): Promise<Gym[]> {
    const gyms: Gym[] = await this.gymsRepository.find();
    return gyms;
  }

  async findOneByName(name: string) {
    return await this.gymsRepository.findOne({
      where: { name, isActive: true },
    });
  }

  async findOneById(id: string): Promise<Gym | null> {
    return await this.gymsRepository.findOne({
      where: { id: parseInt(id), isActive: true },
    });
  }

  async updateOne(gymToUpdate: Gym): Promise<Gym | null> {
    return await this.gymsRepository.save(gymToUpdate);
  }

  async remove(id: string): Promise<boolean> {
    const result: UpdateResult = await this.gymsRepository.update(
      { id: parseInt(id) },
      { isActive: false },
    );

    return result.affected && result.affected > 0 ? true : false;
  }
}
