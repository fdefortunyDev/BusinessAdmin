import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AssociateBusinessToUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @IsArray()
  businessIds: string[];
}
