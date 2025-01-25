import { Injectable } from '@nestjs/common';
import { IGym } from './interfaces/gym.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from './entities/gyms.entity';
import { Repository, UpdateResult } from 'typeorm';
import { GymDataToCreate } from './dtos/in/gym-data-to-creat.dto';

@Injectable()
export class GymsRepositoryService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymModel: Repository<Gym>,
  ) {}

  async create(gymData: GymDataToCreate): Promise<IGym> {
    const { name, address, email, phone, website, user } = gymData;

    const gym: Gym = new Gym();
    gym.name = name;
    gym.address = address;
    gym.email = email;
    gym.phone = phone;
    gym.website = website;
    gym.user = user;

    return await this.gymModel.save(gym);
  }

  async findAll(): Promise<IGym[]> {
    const gyms: IGym[] = await this.gymModel.find({
      where: { isActive: true },
    });
    return gyms;
  }

  async findOneById(id: string): Promise<IGym | null> {
    return await this.gymModel.findOne({
      where: { id, isActive: true },
    });
  }

  async updateOne(gymToUpdate: IGym): Promise<IGym | null> {
    return await this.gymModel.save(gymToUpdate);
  }

  async remove(id: string): Promise<boolean> {
    const result: UpdateResult = await this.gymModel.update(
      { id },
      { isActive: false },
    );

    return result.affected && result.affected > 0 ? true : false;
  }

  async findOneByName(name: string): Promise<IGym | null> {
    return await this.gymModel.findOne({
      where: { name, isActive: true },
    });
  }
}
