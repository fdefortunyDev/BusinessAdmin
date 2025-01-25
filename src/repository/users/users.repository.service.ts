import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersRepositoryService {
  constructor(
    @InjectRepository(User)
    private readonly usersModel: Repository<User>,
  ) {}

  async create() {
    const user = new User();
    user.cognitoUserId = '123';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.document = '123456787';
    user.email = 'example3@gmail.com';
    user.phone = '099113329';
    return await this.usersModel.save(user);
  }

  async findAll() {}

  async findOneById(id: string): Promise<IUser | null> {
    const user: User | null = await this.usersModel.findOneBy({ id });

    if (!user) {
      return null;
    }

    return { ...user } as IUser;
  }

  async updateOne(id: string) {
    return id;
  }

  async remove(id: string) {
    return id;
  }
}
