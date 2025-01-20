import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, Max, MaxLength } from 'class-validator';

export class CreateGymDto {
  @ApiProperty({ example: 'SmartGym' })
  @MaxLength(150)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 'Ruta 8 esq cochabamba' })
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  address: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @MaxLength(255)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: '12345678' })
  @MaxLength(8)
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (value ? value.trim() : value))
  phone?: string;

  @ApiProperty({ example: 'www.smartgym.com.uy' })
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => (value ? value.toLowerCase().trim() : value))
  website?: string;
}
