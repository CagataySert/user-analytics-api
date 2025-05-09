import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';
import { SelfOrAdminGuard } from './guards/self-or-admin.guard';

@Module({
  providers: [RolesGuard, SelfOrAdminGuard],
  exports: [RolesGuard, SelfOrAdminGuard],
})
export class CommonModule {}
