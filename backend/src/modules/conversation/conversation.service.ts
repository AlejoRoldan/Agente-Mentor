import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Conversation, Message, MessageRole } from '@prisma/client';
import { DatabaseService } from '../../config/database.config';

/** Servicio CRUD para conversaciones y mensajes */
@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(private readonly db: DatabaseService) {}

  /** Crea una nueva conversación para un usuario */
  async create(
    userId: string,
    metadata?: Record<string, unknown>,
  ): Promise<Conversation> {
    const conversation = await this.db.conversation.create({
      data: {
        userId,
        metadata: (metadata || {}) as Prisma.InputJsonValue,
      },
    });
    this.logger.log(
      `Conversación creada: ${conversation.id} para usuario ${userId}`,
    );
    return conversation;
  }

  /** Lista las conversaciones activas de un usuario */
  async findByUser(userId: string): Promise<Conversation[]> {
    return this.db.conversation.findMany({
      where: { userId, isActive: true },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /** Obtiene una conversación con su historial de mensajes */
  async findByIdWithMessages(
    conversationId: string,
    userId: string,
  ): Promise<Conversation & { messages: Message[] }> {
    const conversation = await this.db.conversation.findFirst({
      where: { id: conversationId, userId, isActive: true },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    return conversation;
  }

  /** Agrega un mensaje a una conversación */
  async addMessage(
    conversationId: string,
    role: MessageRole,
    content: string,
    metadata?: Record<string, unknown>,
  ): Promise<Message> {
    const message = await this.db.message.create({
      data: {
        conversationId,
        role,
        content,
        metadata: (metadata || {}) as Prisma.InputJsonValue,
      },
    });

    // Actualizar título de la conversación si es el primer mensaje del usuario
    if (role === MessageRole.USER) {
      const messageCount = await this.db.message.count({
        where: { conversationId, role: MessageRole.USER },
      });
      if (messageCount === 1) {
        await this.db.conversation.update({
          where: { id: conversationId },
          data: {
            title: content.substring(0, 100),
            updatedAt: new Date(),
          },
        });
      } else {
        await this.db.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });
      }
    }

    return message;
  }

  /** Obtiene los últimos N mensajes de una conversación (para contexto del agente) */
  async getRecentMessages(
    conversationId: string,
    limit = 20,
  ): Promise<Message[]> {
    return this.db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Soft delete de una conversación */
  async deactivate(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.db.conversation.findFirst({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversación no encontrada');
    }

    await this.db.conversation.update({
      where: { id: conversationId },
      data: { isActive: false },
    });

    this.logger.log(`Conversación desactivada: ${conversationId}`);
  }
}
