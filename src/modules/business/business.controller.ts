import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { BusinessError } from '../../utils/errors/business-error.enum';
import { UsersError } from '../../utils/errors/users-error.enum';
import { BusinessService } from './business.service';

@ApiTags('Business')
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
  async remove(@Param('id') id: string): Promise<IBusinessResponse> {
    try {
      return this.businessService.remove(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
