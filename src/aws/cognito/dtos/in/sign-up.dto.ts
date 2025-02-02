import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEmailDto } from './user-email.dto';

export class SignUpDto extends UserEmailDto {
  @ApiProperty({ example: 'Fede2510!' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  permissions: string;
}
