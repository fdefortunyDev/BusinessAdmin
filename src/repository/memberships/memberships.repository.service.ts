import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipRepositoryService {
  constructor(
    @InjectRepository(Membership)
    private readonly businessModel: Repository<Membership>,
  ) {}
}
