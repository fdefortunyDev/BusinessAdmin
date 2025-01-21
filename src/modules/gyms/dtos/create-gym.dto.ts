import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, Matches, Max, MaxLength, matches } from 'class-validator';
import { GymsError } from '../../../utils/errors/gyms-error.enum';

export class CreateGymDto {
  @ApiProperty({ example: 'SmartGym' })
  @MaxLength(150)
  @Matches(/^[a-z0-9\s]*$/i, {
    message: GymsError.invalidName,
  })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 'Ruta 8 esq cochabamba' })
  @MaxLength(255)
  @Matches(/^[a-z0-9\s\.,-_]*$/i, {
    message: GymsError.invalidAddress,
  })
  @Transform(({ value }) => value.trim())
  address: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, {
    message: GymsError.invalidEmail,
  })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: '12345678' })
  @MaxLength(8)
  @IsOptional()
  @IsNumberString()
  @Matches(/^(2|3|4|5|6|7|8)[0-9]{7}$|^09[0-9]{7}$/, {
    message: GymsError.invalidPhone,
  })
  @Transform(({ value }) => (value ? value.trim() : value))
  phone?: string;

  @ApiProperty({ example: 'www.smartgym.com.uy' })
  @MaxLength(255)
  @IsOptional()
  @Matches(/^(http|https):\/\/[a-z0-9\.-]+\.[a-z]{2,4}/i, {
    message: GymsError.invalidWebsite,
  })
  @Transform(({ value }) => (value ? value.toLowerCase().trim() : value))
  website?: string;
}
