import { IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';
import { RoleName } from '../../roles/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(RoleName)
  roleName: RoleName;
}
