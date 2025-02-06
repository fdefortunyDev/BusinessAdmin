import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { UsersError } from '../../utils/enums/errors/users-error.enum';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../utils/enums/role.enum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: IUserResponse })
  @ApiConflictResponse({ description: UsersError.alreadyExists })
  @ApiServiceUnavailableResponse({ description: UsersError.notCreated })
  @Roles(Role.SuperAdmin)
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
  @Roles(Role.SuperAdmin)
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
  @Roles(Role.BusinessOwner, Role.BusinessUser)
  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<IUserResponse> {
    try {
      const user = req.user;
      return await this.usersService.findOne(id, user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update one user' })
  @ApiOkResponse({ type: IUserResponse })
  @ApiNotFoundResponse({ description: UsersError.notFound })
  @ApiServiceUnavailableResponse({ description: UsersError.notUpdated })
  @Roles(Role.BusinessOwner, Role.BusinessUser)
  @Patch('/:id/update')
  async update(
    @Param('id') id: string,
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
  @Roles(Role.SuperAdmin)
  @Delete('/:id/disable')
  async disable(@Param('id') id: string): Promise<IUserResponse> {
    try {
      return await this.usersService.disable(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
