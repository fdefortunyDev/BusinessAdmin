import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BusinessModule } from './modules/business/business.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './repository/business/entities/business.entity';
import { UsersModule } from './modules/users/users.module';
import { User } from './repository/users/entity/users.entity';
import { CognitoController } from './aws/cognito/cognito.controller';
import { CognitoService } from './aws/cognito/cognito.service';

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
        entities: [Business, User],
        synchronize: true, //TODO: en producción cambiar a false
      }),
    }),
    AuthModule,
    RepositoryModule,
    BusinessModule,
    UsersModule,
  ],
  controllers: [CognitoController],
  providers: [CognitoService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('/cognito');
  }
}
