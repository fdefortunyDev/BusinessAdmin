import { CreateGymDto } from './create-gym.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateGymDto extends PartialType(CreateGymDto) {}