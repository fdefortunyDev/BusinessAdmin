import { Module } from '@nestjs/common';
import { BusinessRepositoryService } from './business/business.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './business/entities/business.entity';
import { UsersRepositoryService } from './users/users.repository.service';
import { User } from './users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, User])],
  providers: [BusinessRepositoryService, UsersRepositoryService],
  exports: [BusinessRepositoryService, UsersRepositoryService],
})
export class RepositoryModule {}
