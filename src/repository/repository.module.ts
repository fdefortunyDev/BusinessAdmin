import { Module } from '@nestjs/common';
import { GymsRepositoryService } from './gyms/gyms.repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gyms } from './gyms/entities/gyms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gyms])],
  providers: [GymsRepositoryService],
  exports: [GymsRepositoryService],
})
export class RepositoryModule {}
