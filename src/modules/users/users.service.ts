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
import { UserDataToUpdate } from '../../repository/users/dtos/in/user-data.to-update.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
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

    console.log(cognitoId);

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
    console.log(requestUser);

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
