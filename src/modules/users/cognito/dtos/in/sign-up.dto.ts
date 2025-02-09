import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';
import { UserEmailDto } from './user-email.dto';

export class SignUpDto extends UserEmailDto {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]+[a-z]+[0-9]+$/)
  password: string;

  @ApiProperty()
  @IsString()
  permissions: string;
}
