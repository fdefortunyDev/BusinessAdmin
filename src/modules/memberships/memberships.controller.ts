import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Role } from '../../utils/enums/role.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Roles(Role.SuperAdmin, Role.BusinessOwner, Role.BusinessAdmin)
  @Post()
  async create(@Body() createMembershipDto: CreateMembershipDto) {
    try {
      return await this.membershipsService.create(createMembershipDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Roles(Role.SuperAdmin, Role.BusinessOwner, Role.BusinessAdmin)
  @Get()
  async findAll() {
    return await this.membershipsService.findAll();
  }

  @Roles(Role.SuperAdmin, Role.BusinessOwner, Role.BusinessAdmin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.membershipsService.findOne(+id);
  }

  @Roles(Role.SuperAdmin, Role.BusinessOwner, Role.BusinessAdmin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return await this.membershipsService.update(+id, updateMembershipDto);
  }

  @Roles(Role.SuperAdmin, Role.BusinessOwner, Role.BusinessAdmin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.membershipsService.remove(+id);
  }
}
