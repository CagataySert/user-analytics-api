import {
  IsNotEmpty,
  IsEnum,
  MaxLength,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { ActivityType } from '../activity-logs.enum';

export class CreateActivityLogDto {
  @IsNotEmpty()
  @IsEnum(ActivityType)
  type: ActivityType;

  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;
}
