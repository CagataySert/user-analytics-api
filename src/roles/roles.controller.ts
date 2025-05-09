import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from './role.enum';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(RoleName.ADMIN)
  async create(
    @Body(ValidationPipe) createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    return await this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles(RoleName.ADMIN)
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  @Roles(RoleName.ADMIN)
  async findById(@Param('id') id: string): Promise<Role> {
    return await this.rolesService.findById(parseInt(id, 10));
  }

  @Put(':id')
  @Roles(RoleName.ADMIN)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    return await this.rolesService.update(parseInt(id, 10), createRoleDto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.rolesService.remove(parseInt(id, 10));
  }
}
