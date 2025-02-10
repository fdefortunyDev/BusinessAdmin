import { ApiProperty } from '@nestjs/swagger';
import { DaysOfWeek } from '../../../utils/enums/memberships/days-of-week.enum';
import { MembershipPeriod } from '../../../utils/enums/memberships/membership-period.enum';
import { TimesPerWeek } from '../../../utils/enums/memberships/times-per-week.enum';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { MembershipsError } from '../../../utils/enums/errors/memberships-error.enum';

export class CreateMembershipDto {
  @ApiProperty({ example: 'Pase Libre' })
  @MaxLength(30, { message: MembershipsError.nameTooLong })
  @MinLength(4, { message: MembershipsError.nameTooShort })
  @Matches(/^[a-z0-9]+[-_a-z0-9]*$/i, {
    message: MembershipsError.invalidName,
  })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 52.9 })
  @IsNumberString()
  @Transform(({ value }) => value.trim())
  price: string;

  @ApiProperty({ example: 'monthly' })
  @IsString()
  @IsEnum(MembershipPeriod, { message: MembershipsError.invalidPeriodEnum })
  @Transform(({ value }) => value.trim())
  period: MembershipPeriod;

  @ApiProperty({ example: '2' })
  @IsString()
  @IsEnum(TimesPerWeek, { message: MembershipsError.invalidTimesPerWeekEnum })
  @Transform(({ value }) => value.trim())
  timesPerWeek: TimesPerWeek;

  @ApiProperty({ example: ['monday', 'sunday'], isArray: true })
  @IsArray()
  @IsEnum(DaysOfWeek, {
    each: true,
    message: MembershipsError.invalidDaysOfWeekEnum,
  })
  daysOfWeek: DaysOfWeek[];

  @ApiProperty({ example: '8' })
  @IsNumberString()
  @Transform(({ value }) => value.trim())
  slots: string;

  @ApiProperty({ example: '433c480d-e639-492e-bfbf-0dfde5e73f42' })
  @IsUUID()
  @Transform(({ value }) => value.trim())
  businessId: string;
}
