import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleName } from './role.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name } = createRoleDto;

    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });

    if (existingRole) {
      throw new ConflictException(
        `A role with this name already exists: ${name}`,
      );
    }

    const role = this.rolesRepository.create({ name });

    return await this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findById(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(
        `Role with the specified ID not found: ${id}`,
      );
    }

    return role;
  }

  async findByName(name: RoleName): Promise<Role | null> {
    return await this.rolesRepository.findOne({ where: { name } });
  }

  async update(id: number, createRoleDto: CreateRoleDto): Promise<Role> {
    const role = await this.findById(id);

    const { name } = createRoleDto;

    if (role.name !== name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name },
      });

      if (existingRole) {
        throw new ConflictException(
          `A role with this name already exists: ${name}`,
        );
      }

      role.name = name;

      return await this.rolesRepository.save(role);
    }

    return role;
  }

  async remove(id: number): Promise<void> {
    const role = await this.findById(id);

    if (!role) {
      throw new NotFoundException(
        `Role with the specified ID not found: ${id}`,
      );
    }

    await this.rolesRepository.remove(role);
  }
}
