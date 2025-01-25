import { Module } from '@nestjs/common';
import { GymsRepositoryService } from './gyms/gyms.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './gyms/entities/gyms.entity';
import { UsersRepositoryService } from './users/users.repository.service';
import { User } from './users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gym, User])],
  providers: [GymsRepositoryService, UsersRepositoryService],
  exports: [GymsRepositoryService, UsersRepositoryService],
})
export class RepositoryModule {}
