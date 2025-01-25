import { Injectable } from '@nestjs/common';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepositoryService: UsersRepositoryService,
  ) {}
  async create() {
    return this.usersRepositoryService.create();
  }

  async findAll() {
    return this.usersRepositoryService.findAll();
  }

  async findOne(id: string) {
    return this.usersRepositoryService.findOneById(id);
  }

  async update(id: string) {
    return this.usersRepositoryService.updateOne(id);
  }

  async remove(id: string) {
    return this.usersRepositoryService.remove(id);
  }
}
