import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ActivityType } from './activity-logs.enum';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column()
  createdAt: Date;
}
