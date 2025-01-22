import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateGymDto } from './dtos/in/create-gym.dto';
import { UpdateGymDto } from './dtos/in/update-gym.dto';

@ApiTags('Gyms')
@ApiSecurity('apikey')
@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @ApiOperation({
    summary: 'register a new gym',
  })
// TODO: @Roles(Role.Admin)
  @Post('create')
  async create(@Body() createGymDto: CreateGymDto) {
    try {
      return this.gymsService.create(createGymDto);
    } catch (err) {
      console.error(err);
    }
  }

  @ApiOperation({
    summary: 'get all gyms',
  })
// TODO: @Roles(Role.Admin)
  @Get('')
  async findAll() {
    try {
      return this.gymsService.findAll();
    } catch (err) {
      console.error(err);
    }
  }

  @ApiOperation({
    summary: 'get one gym',
  })
// TODO: @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.gymsService.findOne(id);
    } catch (err) {
      console.error(err);
    }
  }

  @ApiOperation({
    summary: 'update a gym',
  })
// TODO: @Roles(Role.Admin)
  @Patch(':id/update')
  async update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    try {
      return this.gymsService.update(id, updateGymDto);
    } catch (err) {
      console.error(err);
    }
  }

  @ApiOperation({
    summary: 'disable a gym',
  })
// TODO: @Roles(Role.Admin)
  @Patch(':id/disable')
  async remove(@Param('id') id: string) {
    try {
      return this.gymsService.remove(id);
    } catch (err) {
      console.error(err);
    }
  }
}
