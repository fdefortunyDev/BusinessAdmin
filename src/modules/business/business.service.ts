import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dtos/create-business.dto';
import { BusinessRepositoryService } from '../../repository/business/business.repository.service';
import { UpdateBusinessDto } from './dtos/update-business.dto';
import { BusinessError } from '../../utils/enums/errors/business-error.enum';
import { IBusiness } from '../../repository/business/dtos/out/business-response.dto';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { UsersError } from '../../utils/enums/errors/users-error.enum';
import { IUser } from '../../repository/users/dtos/out/user-response.dto';
import { IBusinessResponse } from './dtos/business-response.dto';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepositoryService: BusinessRepositoryService,
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}

  async create(
    createBusinessDto: CreateBusinessDto,
  ): Promise<IBusinessResponse> {
    const { name, address, email, phone, website, userId } = createBusinessDto;

    const businessExists: IBusiness | null =
      await this.businessRepositoryService.findOneByName(name);

    if (businessExists) {
      throw new ConflictException(BusinessError.alreadyExists);
    }

    const user: IUser | null =
      await this.usersRepositoryService.findOneById(userId);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const createdBusiness: IBusiness =
      await this.businessRepositoryService.create({
        name,
        address,
        email,
        phone,
        website,
        user,
      });

    if (!createdBusiness) {
      throw new ServiceUnavailableException(BusinessError.notCreated);
    }

    const response: IBusinessResponse = {
      id: createdBusiness.id,
      name: createdBusiness.name,
      address: createdBusiness.address,
      email: createdBusiness.email,
      phone: createdBusiness.phone,
      website: createdBusiness.website,
      isActive: createdBusiness.isActive,
    };

    return response;
  }

  async findAll(): Promise<IBusinessResponse[]> {
    const business: IBusiness[] =
      await this.businessRepositoryService.findAll();

    const response: IBusinessResponse[] = business.map((b) => {
      const { id, name, address, email, phone, website, isActive } = b;
      return {
        id,
        name,
        address,
        email,
        phone,
        website,
        isActive,
      };
    });

    return response;
  }

  async findOne(id: string): Promise<IBusinessResponse> {
    const business = await this.businessRepositoryService.findOneById(id);

    if (!business) {
      throw new NotFoundException(BusinessError.notFound);
    }

    const { name, address, email, phone, website, isActive } = business;

    const response: IBusinessResponse = {
      id,
      name,
      address,
      email,
      phone,
      website,
      isActive,
    };

    return response;
  }

  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<IBusinessResponse> {
    const businessToUpdate: IBusiness | null =
      await this.businessRepositoryService.findOneById(id);

    if (!businessToUpdate) {
      throw new NotFoundException(BusinessError.notFound);
    }

    businessToUpdate.name = updateBusinessDto.name ?? businessToUpdate.name;
    businessToUpdate.address =
      updateBusinessDto.address ?? businessToUpdate.address;
    businessToUpdate.email = updateBusinessDto.email ?? businessToUpdate.email;
    businessToUpdate.phone = updateBusinessDto.phone ?? businessToUpdate.phone;
    businessToUpdate.website =
      updateBusinessDto.website ?? businessToUpdate.website;

    const isUpdated: boolean = await this.businessRepositoryService.updateOne(
      businessToUpdate.id,
      businessToUpdate,
    );

    if (!isUpdated) {
      throw new ServiceUnavailableException(BusinessError.notUpdated);
    }

    const { name, address, email, phone, website, isActive } = businessToUpdate;

    const response: IBusinessResponse = {
      id,
      name,
      address,
      email,
      phone,
      website,
      isActive,
    } as IBusinessResponse;

    return response;
  }

  async disable(id: string): Promise<IBusinessResponse> {
    const business: IBusiness | null =
      await this.businessRepositoryService.findOneById(id);
    if (!business) {
      throw new NotFoundException(BusinessError.notFound);
    }

    const disabledBusiness: boolean =
      await this.businessRepositoryService.remove(id);

    if (!disabledBusiness) {
      throw new ServiceUnavailableException(BusinessError.notDisabled);
    }

    const { name, address, email, phone, website } = business;

    const response: IBusinessResponse = {
      id,
      name,
      address,
      email,
      phone,
      website,
      isActive: false,
    };

    return response;
  }
}
