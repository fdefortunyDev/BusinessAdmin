import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserEmailDto {
  @ApiProperty({ example: 'fdefortuny@gmail.com' })
  @IsEmail()
  email: string;
}
