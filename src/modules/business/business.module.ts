import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { RepositoryModule } from '../../repository/repository.module';
import { BusinessService } from './business.service';

@Module({
  imports: [RepositoryModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
