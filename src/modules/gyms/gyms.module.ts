import { Module } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { GymsController } from './gyms.controller';
import { RepositoryModule } from '../../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [GymsController],
  providers: [GymsService],
})
export class GymsModule {}
