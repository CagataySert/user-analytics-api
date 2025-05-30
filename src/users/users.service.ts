import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityType } from 'src/activity-logs/activity-logs.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, roleName, isActive } = createUserDto;

    if (username) {
      const existingUserByUsername = await this.usersRepository.findOne({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new ConflictException(
          `This username is already taken: ${username}`,
        );
      }
    }

    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException(
        `Bu e-posta adresi zaten kullanımda: ${email}`,
      );
    }

    const role = await this.rolesService.findByName(roleName);

    if (!role) {
      throw new NotFoundException(
        `The specified role was not found: ${roleName}`,
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const user = this.usersRepository.create({
      username,
      email,
      passwordHash: hashedPassword,
      role,
      isActive,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({ relations: ['role'] });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with the specified ID not found: ${id}`,
      );
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with the specified username not found: ${username}`,
      );
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const { username, email, password, isActive } = updateUserDto;

    if (username && username !== user.username) {
      const existingUserByUsername = await this.usersRepository.findOne({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new ConflictException(
          `This username is already taken: ${username}`,
        );
      }

      user.username = username;
    }

    if (email && email !== user.email) {
      const existingUserByEmail = await this.usersRepository.findOne({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new ConflictException(
          `This email address is already taken: ${email}`,
        );
      }

      user.email = email;
    }

    if (password) {
      user.passwordHash = await this.hashPassword(password);
    }

    if (isActive) {
      user.isActive = isActive;
    }

    await this.activityLogsService.logActivity({
      userId: user.id,
      type: ActivityType.PROFILE_UPDATE,
    });

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(
        `User with the specified ID not found: ${id}`,
      );
    }

    await this.usersRepository.remove(user);
  }

  async getTotalUserCount(): Promise<number> {
    return this.usersRepository.count();
  }
}
