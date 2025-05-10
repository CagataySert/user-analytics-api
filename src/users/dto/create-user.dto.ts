import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { RoleName } from '../../roles/role.enum';

export class CreateUserDto {
  @IsOptional()
  username?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(RoleName)
  roleName: RoleName;

  @IsNotEmpty()
  isActive: boolean;
}
