import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UsersError } from '../../../utils/errors/users-error.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'abc123-abc123-abc123-abc123' })
  @MaxLength(255, { message: UsersError.invalidCognitoId })
  @Transform(({ value }) => value.trim())
  cognitoId: string;

  @ApiProperty({ example: 'Jhon' })
  @MaxLength(20, { message: UsersError.fisrtNameTooLong })
  @MinLength(2, { message: UsersError.firstNameTooShort })
  @Matches(/^([a-z]+(\s)?){1,2}$/i, {
    message: UsersError.invalidName,
  })
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  )
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @MaxLength(20, { message: UsersError.lastNameTooLong })
  @MinLength(2, { message: UsersError.lastNameTooShort })
  @Matches(/^([a-z]+(\s)?){1,2}$/i, {
    message: UsersError.invalidLastName,
  })
  lastName: string;

  @ApiProperty({ example: '12345678' })
  @MaxLength(8, { message: UsersError.documentTooLong })
  @MinLength(7, { message: UsersError.documentTooShort })
  @IsNumberString()
  @Transform(({ value }) => value.trim())
  document: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @MaxLength(150)
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, {
    message: UsersError.invalidEmail,
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: '099112233' })
  @IsOptional()
  @MaxLength(9, { message: UsersError.invalidPhone })
  @MinLength(8, { message: UsersError.invalidPhone })
  @IsNumberString()
  @Matches(/^(2|3|4|5|6|7|8)[0-9]{7}$|^09[0-9]{7}$/, {
    message: UsersError.invalidPhone,
  })
  @Transform(({ value }) => value.trim())
  phone: string;
}
