import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Repository } from 'typeorm';
import { MembershipDataToCreate } from './dtos/in/membership-data-to-create.dto';
import { IMembership } from './dtos/out/membership-response.dto';

@Injectable()
export class MembershipRepositoryService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipModel: Repository<Membership>,
  ) {}

  async findOneMembershipByName(
    name: string,
    businessId: string,
  ): Promise<IMembership | null> {
    return await this.membershipModel.findOne({
      where: { name, business: { id: businessId } },
      relations: ['business'],
    });
  }

  async createMembership(
    membershipToCreate: MembershipDataToCreate,
  ): Promise<IMembership> {
    const createdMembership: IMembership | null =
      await this.membershipModel.save(membershipToCreate);
    return createdMembership;
  }
}
