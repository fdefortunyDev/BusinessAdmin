import { Injectable } from '@nestjs/common';
import { IBusiness } from './dtos/out/business-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository, UpdateResult } from 'typeorm';
import { BusinessDataToCreate } from './dtos/in/business-data-to-create.dto';

@Injectable()
export class BusinessRepositoryService {
  constructor(
    @InjectRepository(Business)
    private readonly businessModel: Repository<Business>,
  ) {}

  async create(businessData: BusinessDataToCreate): Promise<IBusiness> {
    const { name, address, email, phone, website, user } = businessData;

    const business: Business = new Business();
    business.name = name;
    business.address = address;
    business.email = email;
    business.phone = phone;
    business.website = website;
    business.user = user;

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

  async updateOne(businessToUpdate: IBusiness): Promise<IBusiness | null> {
    return await this.businessModel.save(businessToUpdate);
  }

  async remove(id: string): Promise<boolean> {
    const result: UpdateResult = await this.businessModel.update(
      { id },
      { isActive: false },
    );

    return result.affected && result.affected > 0 ? true : false;
  }

  async findOneByName(name: string): Promise<IBusiness | null> {
    return await this.businessModel.findOne({
      where: { name, isActive: true },
    });
  }
}
