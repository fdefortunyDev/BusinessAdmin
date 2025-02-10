import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { IUserResponse } from './dtos/user.response';
import { CreateUserDto } from './dtos/create-user.dto';
import { IUser } from '../../repository/users/dtos/out/user-response.dto';
import { UsersError } from '../../utils/enums/errors/users-error.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IBusiness } from '../../repository/business/dtos/out/business-response.dto';
import { BusinessRepositoryService } from '../../repository/business/business.repository.service';
import { BusinessError } from '../../utils/enums/errors/business-error.enum';
import { AssociateBusinessToUserDto } from './dtos/associate-business-to-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
    private readonly businessRepositoryService: BusinessRepositoryService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { cognitoId, document, email, phone } = createUserDto;

    const userExists: IUser | null =
      await this.usersRepositoryService.checkIfUserAlreadyExists(
        document,
        email,
        phone,
        cognitoId,
      );

    if (userExists) {
      throw new ConflictException(UsersError.alreadyExists);
    }

    const createdUser: IUser | null =
      await this.usersRepositoryService.create(createUserDto);

    if (!createdUser) {
      throw new ServiceUnavailableException(UsersError.notCreated);
    }

    const response: IUserResponse = {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      document: createdUser.document,
      email: createdUser.email,
      phone: createdUser.phone,
      isActive: createdUser.isActive,
    };

    return response;
  }

  async associateBusinessesToUser(
    associateBusinessDto: AssociateBusinessToUserDto,
  ): Promise<IUserResponse> {
    const { userId, businessIds } = associateBusinessDto;

    const user: IUser | null =
      await this.usersRepositoryService.findOneById(userId);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const businessList: IBusiness[] =
      await this.businessRepositoryService.findByIds(businessIds);

    if (!businessList || businessList.length === 0) {
      throw new Error(BusinessError.notFound);
    }
    for(const business of businessList) {
      if (await business.user.id !== userId) {
        throw new ConflictException(BusinessError.businessIdNotAssociableToUser);
      }
    }

    const updatedUser: IUser =
      await this.usersRepositoryService.associateBusinessesToUser(
        user,
        businessList,
      );

    const { businesses, ...rest } = updatedUser;
    return rest as IUserResponse;
  }

  async findAll(): Promise<IUserResponse[]> {
    const users: IUser[] = await this.usersRepositoryService.findAll();
    return users.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        document: user.document,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
      } as IUserResponse;
    });
  }

  async findOne(id: string, requestUser: any): Promise<IUserResponse> {
    const user: IUser | null =
      await this.usersRepositoryService.findOneById(id);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    if (user.cognitoId !== requestUser.sub) {
      throw new ForbiddenException();
    }

    const response: IUserResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      document: user.document,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    };

    return response;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user: IUser | null =
      await this.usersRepositoryService.findOneById(id);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const { firstName, lastName, phone, email, document } = updateUserDto;

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.phone = phone ?? user.phone;
    user.email = email ?? user.email;
    user.document = document ?? user.document;

    const userUpdated: boolean = await this.usersRepositoryService.updateOne(
      id,
      user,
    );

    if (!userUpdated) {
      throw new ServiceUnavailableException(UsersError.notUpdated);
    }

    const response: IUserResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      document: user.document,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    };

    return response;
  }

  async disable(id: string): Promise<IUserResponse> {
    const user: IUser | null =
      await this.usersRepositoryService.findOneById(id);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const isRemoved: boolean = await this.usersRepositoryService.remove(id);
    if (!isRemoved) {
      throw new ServiceUnavailableException(UsersError.notRemoved);
    }

    const response: IUserResponse = {
      ...user,
      isActive: false,
    };

    return response;
  }
}
