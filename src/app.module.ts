import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GymsModule } from './modules/gyms/gyms.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './repository/gyms/entities/gyms.entity';
import { UsersModule } from './modules/users/users.module';
import { User } from './repository/users/entity/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASS'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [Gym, User],
        synchronize: true, //TODO: en producción cambiar a false
      }),
    }),
    AuthModule,
    RepositoryModule,
    GymsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('/gyms', '/users');
  }
}
