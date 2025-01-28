import { PartialType } from '@nestjs/swagger';
import { GymDataToCreate } from './gym-data-to-create.dto';

export class GymDataToUpdate extends PartialType(GymDataToCreate) {}
