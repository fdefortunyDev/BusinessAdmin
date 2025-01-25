import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiSecurity('apikey')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create() {
    return await this.usersService.create();
  }

  @Get('/findAll')
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('/findOne')
  async findOne(id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch('/update')
  async update(id: string) {
    return await this.usersService.update(id);
  }

  @Delete('/remove')
  async remove(id: string) {
    return await this.usersService.remove(id);
  }
}
