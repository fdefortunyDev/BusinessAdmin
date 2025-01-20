import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GymsModule } from './modules/gyms/gyms.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [ConfigModule.forRoot(), GymsModule, AuthModule, RepositoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
