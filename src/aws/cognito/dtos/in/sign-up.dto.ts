import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEmailDto } from './user-email.dto';

export class SignUpDto extends UserEmailDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  permissions: string;
}
