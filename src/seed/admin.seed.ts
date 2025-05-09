import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RoleName } from 'src/roles/role.enum';

@Injectable()
export class AdminSeeder {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(private readonly usersService: UsersService) {}

  async seed(adminUsername: string, adminEmail: string, adminPassword: string) {
    try {
      const existingAdmin =
        await this.usersService.findByUsername(adminUsername);

      if (existingAdmin) {
        this.logger.log('Admin user already exists. Skipping seeding.');
        return;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.log(`Admin user not found. Proceeding with creation.`);
        await this.usersService.create({
          username: adminUsername,
          email: adminEmail,
          password: adminPassword,
          roleName: RoleName.ADMIN,
        });
        this.logger.log('Admin user has been created.');
        return;
      }

      this.logger.error(
        `An unexpected error occurred during admin user check: ${error}`,
      );

      throw error;
    }
  }
}
