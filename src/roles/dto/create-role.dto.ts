import { IsNotEmpty, IsEnum } from 'class-validator';
import { RoleName } from '../role.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleName)
  name: RoleName;
}
