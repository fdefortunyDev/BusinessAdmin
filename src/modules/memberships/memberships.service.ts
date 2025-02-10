import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipRepositoryService } from '../../repository/memberships/memberships.repository.service';
import { IMembership } from '../../repository/memberships/dtos/out/membership-response.dto';
import { MembershipsError } from '../../utils/enums/errors/memberships-error.enum';
import { IBusiness } from '../../repository/business/dtos/out/business-response.dto';
import { BusinessRepositoryService } from '../../repository/business/business.repository.service';
import { BusinessError } from '../../utils/enums/errors/business-error.enum';
import { IMembershipResponse } from './dto/membership-response.dto';

@Injectable()
export class MembershipsService {
  constructor(
    private readonly membershipRepositoryService: MembershipRepositoryService,
    private readonly businessRepositoryService: BusinessRepositoryService,
  ) {}

  async create(
    membershipDto: CreateMembershipDto,
  ): Promise<IMembershipResponse> {
    const isExist: boolean = await this.checkIfMembershipExists(
      membershipDto.name,
      membershipDto.businessId,
    );

    if (isExist) {
      throw new Error(MembershipsError.alreadyExists);
    }

    const business: IBusiness | null =
      await this.businessRepositoryService.findOneById(
        membershipDto.businessId,
      );

    if (!business) {
      throw new Error(BusinessError.notFound);
    }

    const { businessId, ...rest } = membershipDto;

    const createdMembership: IMembership | null =
      await this.membershipRepositoryService.createMembership({
        ...rest,
        price: parseFloat(Number(membershipDto.price).toFixed(2)),
        slots: parseInt(membershipDto.slots),
        daysOfWeek: membershipDto.daysOfWeek
          .map((day) => day.replace(/\s+/g, ''))
          .toString(),
        business,
      });

    if (!createdMembership) {
      throw new ServiceUnavailableException(MembershipsError.notCreated);
    }

    const {
      id,
      name,
      daysOfWeek,
      period,
      price,
      slots,
      timesPerWeek,
      createdAt,
      updatedAt,
    } = createdMembership;

    const response: IMembershipResponse = {
      id,
      businessId: membershipDto.businessId,
      name,
      daysOfWeek,
      period,
      price,
      slots,
      timesPerWeek: Number(createdMembership.timesPerWeek),
      createdAt,
      updatedAt,
    };

    return response;
  }

  findAll() {
    return `This action returns all memberships`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return `This action updates a #${id} membership`;
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }

  private async checkIfMembershipExists(
    name: string,
    businessId: string,
  ): Promise<boolean> {
    const membership: IMembership | null =
      await this.membershipRepositoryService.findOneMembershipByName(
        name,
        businessId,
      );
    return membership ? true : false;
  }
}
