import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GymsService } from './gyms.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateGymDto } from './dtos/create-gym.dto';
import { UpdateGymDto } from './dtos/update-gym.dto';
import { IGymResponse } from './dtos/gym-response.dto';

@ApiTags('Gyms')
@ApiSecurity('apikey')
@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @ApiOperation({
    summary: 'Create a new gym',
  })
  @Post('create')
  async create(@Body() createGymDto: CreateGymDto): Promise<IGymResponse> {
    try {
      return this.gymsService.create(createGymDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Get all gyms',
  })
  @Get('')
  async findAll(): Promise<IGymResponse[]> {
    try {
      return this.gymsService.findAll();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Get one gym',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IGymResponse> {
    try {
      return this.gymsService.findOne(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Update a gym',
  })
  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Body() updateGymDto: UpdateGymDto,
  ): Promise<IGymResponse> {
    try {
      return this.gymsService.update(id, updateGymDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Disable one gym',
  })
  @Delete(':id/disable')
  async remove(@Param('id') id: string): Promise<IGymResponse> {
    try {
      return this.gymsService.remove(id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
