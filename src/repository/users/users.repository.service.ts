import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entity/users.entity';
import { IUser } from './dtos/out/user-response.dto';
import { UserDataToCreate } from './dtos/in/user-data-to-create.dto';

@Injectable()
export class UsersRepositoryService {
  constructor(
    @InjectRepository(User)
    private readonly usersModel: Repository<User>,
  ) {}

  async create(userDataToCreate: UserDataToCreate): Promise<IUser> {
    const { cognitoId, firstName, lastName, document, email, phone } =
      userDataToCreate;

    const user: User = new User();
    user.cognitoId = cognitoId;
    user.firstName = firstName;
    user.lastName = lastName;
    user.document = document;
    user.email = email;
    user.phone = phone;

    return await this.usersModel.save(user);
  }

  async findAll(): Promise<IUser[]> {
    return this.usersModel.find({
      where: { isActive: true },
      select: [
        'id',
        'firstName',
        'lastName',
        'document',
        'email',
        'phone',
        'isActive',
      ],
    });
  }

  async findOneById(id: string): Promise<IUser | null> {
    const user: User | null = await this.usersModel.findOneBy({ id });

    return user ?? null;
  }

  async checkIfUserAlreadyExists(
    document: string,
    email: string,
    phone: string,
    cognitoId: string,
  ): Promise<IUser | null> {
    const user: User | null = await this.usersModel.findOne({
      where: [{ document }, { email }, { phone }, { cognitoId }],
    });

    return user;
  }

  async updateOne(
    id: string,
    userDataToUpdate: UserDataToCreate,
  ): Promise<boolean> {
    const result: UpdateResult = await this.usersModel.update(
      id,
      userDataToUpdate,
    );

    return result.affected && result.affected > 0 ? true : false;
  }

  async remove(id: string): Promise<boolean> {
    const result: UpdateResult = await this.usersModel.update(
      { id },
      { isActive: false },
    );
    return result.affected && result.affected > 0 ? true : false;
  }
}
