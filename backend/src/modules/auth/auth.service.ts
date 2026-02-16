import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  JwtPayload,
} from './dto/auth.dto';

/** Servicio de autenticación — registro y login con JWT */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /** Registra un nuevo estudiante y retorna token JWT */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    this.logger.log(`Nuevo registro: ${user.email}`);

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /** Autentica un usuario y retorna token JWT */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.validateCredentials(
      dto.email,
      dto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    this.logger.log(`Login exitoso: ${user.email}`);

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
