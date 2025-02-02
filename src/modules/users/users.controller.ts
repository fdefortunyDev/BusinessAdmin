import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUserResponse } from './dtos/user.response';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersError } from '../../utils/errors/users-error.enum';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../utils/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: IUserResponse })
  @ApiConflictResponse({ description: UsersError.alreadyExists })
  @ApiServiceUnavailableResponse({ description: UsersError.notCreated })
  @Post('/create')
  async create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ type: [IUserResponse] })
  @Roles(Role.Admin)
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
  @ApiOkResponse({ type: IUserResponse })
  @ApiNotFoundResponse({ description: UsersError.notFound })
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
  @ApiOkResponse({ type: IUserResponse })
  @ApiNotFoundResponse({ description: UsersError.notFound })
  @ApiServiceUnavailableResponse({ description: UsersError.notUpdated })
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
  @ApiOkResponse({ type: IUserResponse })
  @ApiNotFoundResponse({ description: UsersError.notFound })
  @ApiServiceUnavailableResponse({ description: UsersError.notRemoved })
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
