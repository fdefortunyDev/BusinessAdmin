import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { IUserResponse } from './dtos/user.response';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  IUser,
  UserDataToUpdate,
} from '../../repository/users/interfaces/user.interface';
import { UsersError } from '../../utils/errors/users-error.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const { cognitoId, firstName, lastName, document, email, phone } =
      createUserDto;

    const userExists =
      await this.usersRepositoryService.checkIfUserAlreadyExists(email, phone);

    if (userExists) {
      throw new ConflictException(UsersError.alreadyExists);
    }

    const createdUser: IUser | null = await this.usersRepositoryService.create({
      cognitoId,
      firstName,
      lastName,
      document,
      email,
      phone,
    });

    if (!createdUser) {
      throw new ServiceUnavailableException(UsersError.notCreated);
    }

    return {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      document: createdUser.document,
      email: createdUser.email,
      phone: createdUser.phone,
      isActive: createdUser.isActive,
    } as IUserResponse;
  }

  async findAll(): Promise<IUserResponse[]> {
    return this.usersRepositoryService.findAll();
  }

  async findOne(id: string): Promise<IUserResponse> {
    const user: IUser | null =
      await this.usersRepositoryService.findOneById(id);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      document: user.document,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    } as IUserResponse;
  }

  async update(
    id: string,
    userDataToUpdate: UserDataToUpdate,
  ): Promise<IUserResponse> {
    const user: IUser | null =
      await this.usersRepositoryService.findOneById(id);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const { firstName, lastName, phone, email, document } = userDataToUpdate;

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

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      document: user.document,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    } as IUserResponse;
  }

  async remove(id: string): Promise<IUserResponse> {
    const user: IUser | null =
      await this.usersRepositoryService.findOneById(id);

    if (!user) {
      throw new NotFoundException(UsersError.notFound);
    }

    const isRemoved: boolean = await this.usersRepositoryService.remove(id);
    if (!isRemoved) {
      throw new ServiceUnavailableException(UsersError.notRemoved);
    }

    return {
      ...user,
      isActive: false,
    } as IUserResponse;
  }
}
