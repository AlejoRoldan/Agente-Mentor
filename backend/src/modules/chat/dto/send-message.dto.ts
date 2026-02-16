import { IsString, IsOptional, IsUUID, MinLength } from 'class-validator';

/** DTO para envío de mensaje via WebSocket */
export class SendMessageDto {
  @IsString()
  @MinLength(1, { message: 'El mensaje no puede estar vacío' })
  content!: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID de conversación inválido' })
  conversationId?: string;

  @IsOptional()
  @IsString()
  bootcamp?: string;

  @IsOptional()
  currentWeek?: number;
}
