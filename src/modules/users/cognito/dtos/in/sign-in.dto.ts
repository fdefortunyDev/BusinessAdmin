import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEmailDto } from './user-email.dto';

export class SignInDto extends UserEmailDto {
  @ApiProperty({ example: 'Fede2510!' })
  @IsString()
  password: string;
}
