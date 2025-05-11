import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { CommonModule } from 'src/common/common.module';
import { ActivityLogsModule } from 'src/activity-logs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    CommonModule,
    ActivityLogsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
