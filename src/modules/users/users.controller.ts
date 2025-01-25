import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { IUserResponse } from './dtos/user.response';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@ApiSecurity('apikey')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: IUserResponse })
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
    try {
      console.log('createUserDto', createUserDto);
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [IUserResponse] })
  @Get('/')
  async findAll(): Promise<IUserResponse[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get one user' })
  @Get('/:id')
  async findOne(@Param() id: string): Promise<IUserResponse> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update one user' })
  @Patch('/:id/update')
  async update(
    @Param() id: string,
    @Body() userDataToUpdate: UpdateUserDto,
  ): Promise<IUserResponse> {
    try {
      return await this.usersService.update(id, userDataToUpdate);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Disable one user' })
  @Delete('/:id/remove')
  async remove(@Param('id') id: string): Promise<IUserResponse> {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
