import { Module } from '@nestjs/common';
import { BusinessRepositoryService } from './business/business.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './business/entities/business.entity';
import { UsersRepositoryService } from './users/users.repository.service';
import { User } from './users/entity/users.entity';
import { Membership } from './memberships/entities/membership.entity';
import { MembershipRepositoryService } from './memberships/memberships.repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([Business, User, Membership])],
  providers: [
    BusinessRepositoryService,
    UsersRepositoryService,
    MembershipRepositoryService,
  ],
  exports: [
    BusinessRepositoryService,
    UsersRepositoryService,
    MembershipRepositoryService,
  ],
})
export class RepositoryModule {}
