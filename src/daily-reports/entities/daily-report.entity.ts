import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('daily_reports')
export class DailyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  reportDate: Date;

  @Column({ type: 'int', default: 0 })
  totalLogins: number;

  @Column({ type: 'int', default: 0 })
  failedLogins: number;

  @Column({ type: 'int', default: 0 })
  newUsers: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
} 