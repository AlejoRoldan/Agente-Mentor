import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/** Controlador REST para operaciones de chat (historial, listado, eliminación) */
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /** Lista las conversaciones del usuario autenticado */
  @Get('conversations')
  async listConversations(@Request() req: { user: { id: string } }) {
    return this.chatService.listConversations(req.user.id);
  }

  /** Obtiene el historial de una conversación específica */
  @Get('conversations/:id')
  async getConversation(
    @Request() req: { user: { id: string } },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatService.getHistory(req.user.id, id);
  }

  /** Elimina (soft delete) una conversación */
  @Delete('conversations/:id')
  async deleteConversation(
    @Request() req: { user: { id: string } },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.chatService.deleteConversation(req.user.id, id);
    return { message: 'Conversación eliminada' };
  }
}
