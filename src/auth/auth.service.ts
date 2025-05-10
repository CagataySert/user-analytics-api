import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RoleName } from 'src/roles/role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async activateUser(token: string) {
    try {
      const payload = await this.jwtService.verify(token);

      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if (user.isActive) {
        return { message: 'This account has already been activated.' };
      }

      await this.usersService.update(user.id, { isActive: true });

      return {
        message:
          'Your email address has been verified successfully. You can log in.',
      };
    } catch (error) {
      throw new BadRequestException(
        'Invalid or expired activation token.',
        error.message,
      );
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = await this.usersService.create({
      email,
      password,
      roleName: RoleName.USER,
      isActive: false,
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role.name,
    };

    const activationToken = await this.jwtService.signAsync(payload);

    // In production, we would send this token to the user's email
    this.logger.log(`Activation token for ${email}: ${activationToken}`);

    return {
      message:
        'Registration successful. Please check your email to activate your account.',
    };
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<AuthResponseDto | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    if (!user.isActive) {
      this.logger.warn(`User with email ${email} is not active`);
      throw new UnauthorizedException('User is not activated');
    }

    if (await bcrypt.compare(pass, user.passwordHash)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;

      return result;
    }

    return null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
