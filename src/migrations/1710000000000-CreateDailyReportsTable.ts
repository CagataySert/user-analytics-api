import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDailyReportsTable1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE daily_reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        report_date DATE NOT NULL,
        total_logins INTEGER NOT NULL DEFAULT 0,
        failed_logins INTEGER NOT NULL DEFAULT 0,
        new_users INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        metadata JSONB,
        UNIQUE(report_date)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE daily_reports;`);
  }
} 