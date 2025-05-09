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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, roleName } = createUserDto;

    const existingUserByUsername = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUserByUsername) {
      throw new ConflictException(
        `This username is already taken: ${username}`,
      );
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const { username, email, password } = updateUserDto;

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
}
