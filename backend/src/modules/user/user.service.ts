import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../config/database.config';

/** Servicio para gestión de usuarios */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly db: DatabaseService) {}

  /** Busca un usuario por email */
  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  /** Busca un usuario por ID */
  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  /** Crea un nuevo usuario con contraseña hasheada */
  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const user = await this.db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role || UserRole.STUDENT,
      },
    });

    this.logger.log(`Usuario creado: ${user.email} (${user.role})`);
    return user;
  }

  /** Valida credenciales de un usuario */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
