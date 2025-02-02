import { PartialType } from '@nestjs/swagger';
import { BusinessDataToCreate } from './business-data-to-create.dto';

export class BusinessDataToUpdate extends PartialType(BusinessDataToCreate) {}
