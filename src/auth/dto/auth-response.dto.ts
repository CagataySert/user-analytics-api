import { Role } from 'src/roles/role.entity';

export class AuthResponseDto {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
