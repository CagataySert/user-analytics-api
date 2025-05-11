import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';
import { RedisCacheService } from './services/redis-cache.service';

@Module({
  providers: [RolesGuard, SelfOrAdminGuard,RedisCacheService],
  exports: [RolesGuard, SelfOrAdminGuard,RedisCacheService],
})
export class CommonModule {}
