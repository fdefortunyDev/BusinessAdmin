import { Injectable } from '@nestjs/common';
import { IBusiness } from './dtos/out/business-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { BusinessDataToCreate } from './dtos/in/business-data-to-create.dto';
import { BusinessDataToUpdate } from './dtos/in/business-data-to-update.dto';
import { User } from '../users/entity/users.entity';
import { UsersError } from '../../utils/enums/errors/users-error.enum';

@Injectable()
export class BusinessRepositoryService {
  constructor(
    @InjectRepository(Business)
    private readonly businessModel: Repository<Business>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}

  async create(businessData: BusinessDataToCreate): Promise<IBusiness> {
    const { name, address, email, phone, website, user } = businessData;

    const business: Business = new Business();
    business.name = name;
    business.address = address;
    business.email = email;
    business.phone = phone;
    business.website = website;

    const userEntity = await this.userModel.findOne({ where: { id: user.id } });

    if (!userEntity) {
      throw new Error(UsersError.notFound);
    }

    business.user = userEntity;

    return await this.businessModel.save(business);
  }

  async findAll(): Promise<IBusiness[]> {
    const business: IBusiness[] = await this.businessModel.find({
      where: { isActive: true },
    });
    return business;
  }

  async findOneById(id: string): Promise<IBusiness | null> {
    return await this.businessModel.findOne({
      where: { id, isActive: true },
    });
  }

  async findByIds(ids: string[]): Promise<IBusiness[]> {
    return await this.businessModel.find({ where: { id: In(ids) } });
  }

  async findOneByName(name: string): Promise<IBusiness | null> {
    return await this.businessModel.findOne({
      where: { name, isActive: true },
    });
  }

  async updateOne(
    businessId: string,
    businessToUpdate: BusinessDataToUpdate,
  ): Promise<boolean> {
    const result: UpdateResult = await this.businessModel.update(
      businessId,
      businessToUpdate,
    );
    return result && result.affected ? true : false;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.businessModel.update({ id }, { isActive: false });
    return result.affected === 1;
  }
}
