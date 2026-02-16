import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/** DTO para registro de usuario */
export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}

/** DTO para login de usuario */
export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  password!: string;
}

/** Respuesta de autenticación con token JWT */
export class AuthResponseDto {
  accessToken!: string;
  user!: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/** Payload del token JWT */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
