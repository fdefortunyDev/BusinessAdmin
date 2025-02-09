import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { RepositoryModule } from '../../repository/repository.module';
import { BusinessService } from './business.service';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [RepositoryModule, UsersModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
