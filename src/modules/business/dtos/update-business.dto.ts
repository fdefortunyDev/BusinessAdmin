import { CreateBusinessDto } from './create-business.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
