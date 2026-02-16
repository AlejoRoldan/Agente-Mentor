import { Injectable, Logger } from '@nestjs/common';
import { MessageRole } from '@prisma/client';
import { ConversationService } from '../conversation/conversation.service';
import { AgentService, StreamCallback } from '../agent/agent.service';
import { AgentResponse } from '../../shared/interfaces/agent-response.interface';
import { StudentContext } from '../../shared/interfaces/llm-provider.interface';

/** Datos del usuario autenticado */
interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Servicio de chat — conecta el gateway WebSocket con el agente y la persistencia.
 * Orquesta el flujo: mensaje → agente → DB → respuesta.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly conversationService: ConversationService,
    private readonly agentService: AgentService,
  ) {}

  /**
   * Procesa un mensaje del estudiante con streaming.
   * Crea conversación si no existe, persiste mensajes, invoca al agente.
   */
  async handleMessage(
    user: AuthUser,
    content: string,
    conversationId?: string,
    onToken?: StreamCallback,
    metadata?: { bootcamp?: string; currentWeek?: number },
  ): Promise<{
    conversationId: string;
    response: AgentResponse;
  }> {
    // Crear o recuperar conversación
    let convId = conversationId;
    if (!convId) {
      const conversation = await this.conversationService.create(user.id, {
        bootcamp: metadata?.bootcamp,
        currentWeek: metadata?.currentWeek,
      });
      convId = conversation.id;
      this.logger.log(`Nueva conversación creada: ${convId}`);
    }

    // Persistir mensaje del usuario
    await this.conversationService.addMessage(
      convId,
      MessageRole.USER,
      content,
    );

    // Obtener historial reciente para contexto
    const recentMessages = await this.conversationService.getRecentMessages(
      convId,
      20,
    );
    const messageHistory = this.agentService.convertToLangChainMessages(
      recentMessages.reverse().map((m) => ({
        role: m.role,
        content: m.content,
      })),
    );

    const studentContext: StudentContext = {
      userId: user.id,
      conversationId: convId,
      bootcamp: metadata?.bootcamp,
      currentWeek: metadata?.currentWeek,
    };

    // Invocar al agente con o sin streaming
    let response: AgentResponse;
    if (onToken) {
      response = await this.agentService.processMessageWithStreaming(
        content,
        studentContext,
        messageHistory,
        onToken,
      );
    } else {
      response = await this.agentService.processMessage(
        content,
        studentContext,
        messageHistory,
      );
    }

    // Persistir respuesta del agente
    await this.conversationService.addMessage(
      convId,
      MessageRole.ASSISTANT,
      response.content,
      response.metadata as unknown as Record<string, unknown>,
    );

    this.logger.log(
      `Mensaje procesado — conversación: ${convId}, tipo: ${response.queryType}, latencia: ${response.metadata.latencyMs}ms`,
    );

    return { conversationId: convId, response };
  }

  /** Obtiene el historial de una conversación */
  async getHistory(userId: string, conversationId: string) {
    return this.conversationService.findByIdWithMessages(
      conversationId,
      userId,
    );
  }

  /** Lista las conversaciones de un usuario */
  async listConversations(userId: string) {
    return this.conversationService.findByUser(userId);
  }

  /** Elimina (soft delete) una conversación */
  async deleteConversation(userId: string, conversationId: string) {
    return this.conversationService.deactivate(conversationId, userId);
  }
}
