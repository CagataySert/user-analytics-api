import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { RoleName } from 'src/roles/role.enum';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = parseInt(request.params.id, 10);

    const isAdmin = user?.roles?.includes(RoleName.ADMIN);
    const isSelf = user?.userId === targetUserId;

    if (isSelf || isAdmin) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
