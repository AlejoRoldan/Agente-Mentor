import { IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/** DTO para obtener historial de chat */
export class ChatHistoryDto {
  @IsUUID('4')
  conversationId!: string;
}

/** DTO para listar conversaciones con paginación */
export class ListConversationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
