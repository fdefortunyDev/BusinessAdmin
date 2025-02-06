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
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBusinessDto } from './dtos/create-business.dto';
import { UpdateBusinessDto } from './dtos/update-business.dto';
import { IBusinessResponse } from './dtos/business-response.dto';
import { BusinessError } from '../../utils/enums/errors/business-error.enum';
import { UsersError } from '../../utils/enums/errors/users-error.enum';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../../utils/enums/role.enum';

@ApiTags('Business')
@UseGuards(JwtAuthGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({
    summary: 'Create a new business',
  })
  @ApiConflictResponse({ description: BusinessError.alreadyExists })
  @ApiNotFoundResponse({ description: UsersError.notFound })
  @ApiServiceUnavailableResponse({ description: BusinessError.notCreated })
  @ApiCreatedResponse({ type: IBusinessResponse })
  @Roles(Role.SuperAdmin)
  @Post('create')
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
  ): Promise<IBusinessResponse> {
    try {
      return this.businessService.create(createBusinessDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Get all business',
  })
  @ApiOkResponse({ type: [IBusinessResponse] })
  @Roles(Role.SuperAdmin)
  @Get('')
  async findAll(): Promise<IBusinessResponse[]> {
    try {
      return this.businessService.findAll();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Get one business',
  })
  @ApiNotFoundResponse({ description: BusinessError.notFound })
  @ApiOkResponse({ type: IBusinessResponse })
  @Roles(Role.BusinessOwner)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IBusinessResponse> {
    try {
      return this.businessService.findOne(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Update one business',
  })
  @ApiNotFoundResponse({ description: BusinessError.notFound })
  @ApiServiceUnavailableResponse({ description: BusinessError.notUpdated })
  @ApiOkResponse({ type: IBusinessResponse })
  @Roles(Role.BusinessOwner)
  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<IBusinessResponse> {
    try {
      return this.businessService.update(id, updateBusinessDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Disable one business',
  })
  @ApiNotFoundResponse({ description: BusinessError.notFound })
  @ApiServiceUnavailableResponse({ description: BusinessError.notUpdated })
  @ApiOkResponse({ type: IBusinessResponse })
  @Delete(':id/disable')
  async disable(@Param('id') id: string): Promise<IBusinessResponse> {
    try {
      return this.businessService.disable(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
