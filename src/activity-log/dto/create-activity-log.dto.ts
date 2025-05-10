import {
  IsNotEmpty,
  IsEnum,
  MaxLength,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ActivityType } from '../activity-log.enum';

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
}
