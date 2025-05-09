import { SetMetadata } from '@nestjs/common';
import { RoleName } from 'src/roles/role.enum';

export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
