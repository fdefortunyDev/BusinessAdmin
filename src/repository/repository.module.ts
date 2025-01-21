import { Module } from '@nestjs/common';
import { GymsRepositoryService } from './gyms/gyms.repository.service';

@Module({
  imports: [],
  providers: [GymsRepositoryService],
  exports: [GymsRepositoryService],
})
export class RepositoryModule {}
