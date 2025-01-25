import { PartialType } from '@nestjs/swagger';
import { GymDataToCreate } from './gym-data-to-creat.dto';

export class GymDataToUpdate extends PartialType(GymDataToCreate) {}
