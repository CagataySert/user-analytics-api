import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { AdminAnalyticsModule } from './admin-analytics/admin-analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('CacheModule');
        
        try {
          logger.log('Initializing Redis store...');
          
          return {
            store: redisStore,
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            auth_pass: configService.get<string>('REDIS_PASSWORD'),
            ttl: 600,
            max: 100,
          };
        } catch (error) {
          logger.error('Failed to initialize Redis store:', error);
          throw error;
        }
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT') || 5432,
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: process.env.NODE_ENV !== 'production',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CommonModule,
    ActivityLogsModule,
    AdminAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
