import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { WsExceptionFilter } from '../../shared/filters/ws-exception.filter';
import { JwtPayload } from '../auth/dto/auth.dto';

/** Mapa de clientes conectados: socketId → datos del usuario */
interface ConnectedClient {
  userId: string;
  email: string;
  name: string;
}

/**
 * Gateway WebSocket para chat en tiempo real.
 * Gestiona conexiones, autenticación y streaming de mensajes.
 */
@WebSocketGateway({
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
@UseFilters(new WsExceptionFilter())
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly connectedClients = new Map<string, ConnectedClient>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  /** Autenticación en la conexión WebSocket */
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Conexión rechazada — sin token: ${client.id}`);
        client.emit('error', { message: 'Token de autenticación requerido' });
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);
      this.connectedClients.set(client.id, {
        userId: payload.sub,
        email: payload.email,
        name: payload.email,
      });

      this.logger.log(
        `Cliente conectado: ${payload.email} (${client.id})`,
      );
      client.emit('connected', { message: 'Conexión establecida con Itti Mentor' });
    } catch {
      this.logger.warn(`Token inválido — desconectando: ${client.id}`);
      client.emit('error', { message: 'Token inválido o expirado' });
      client.disconnect();
    }
  }

  /** Limpieza al desconectar */
  handleDisconnect(client: Socket): void {
    const user = this.connectedClients.get(client.id);
    if (user) {
      this.logger.log(`Cliente desconectado: ${user.email} (${client.id})`);
      this.connectedClients.delete(client.id);
    }
  }

  /** Recibe un mensaje del estudiante y envía respuesta con streaming */
  @SubscribeMessage('send_message')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<void> {
    const user = this.connectedClients.get(client.id);
    if (!user) {
      client.emit('error', { message: 'No autenticado' });
      return;
    }

    // Indicador de "escribiendo"
    client.emit('typing', { isTyping: true });

    try {
      const result = await this.chatService.handleMessage(
        { id: user.userId, email: user.email, name: user.name, role: 'STUDENT' },
        dto.content,
        dto.conversationId,
        // Callback de streaming: emite cada token al cliente
        (event) => {
          if (event.done) {
            client.emit('typing', { isTyping: false });
            return;
          }
          client.emit('stream_token', {
            token: event.token,
            conversationId: dto.conversationId,
          });
        },
        {
          bootcamp: dto.bootcamp,
          currentWeek: dto.currentWeek,
        },
      );

      // Enviar respuesta completa al finalizar
      client.emit('message_response', {
        conversationId: result.conversationId,
        content: result.response.content,
        queryType: result.response.queryType,
        metadata: result.response.metadata,
      });
    } catch (error) {
      this.logger.error(
        `Error procesando mensaje: ${error instanceof Error ? error.message : 'Unknown'}`,
        error instanceof Error ? error.stack : undefined,
      );
      client.emit('typing', { isTyping: false });
      client.emit('error', {
        message: 'Error al procesar tu mensaje. Intenta de nuevo.',
      });
    }
  }

  /** Permite al cliente solicitar el historial de una conversación */
  @SubscribeMessage('get_history')
  async handleGetHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const user = this.connectedClients.get(client.id);
    if (!user) {
      client.emit('error', { message: 'No autenticado' });
      return;
    }

    try {
      const history = await this.chatService.getHistory(
        user.userId,
        data.conversationId,
      );
      client.emit('history', history);
    } catch (error) {
      client.emit('error', {
        message: 'Error al obtener historial',
      });
    }
  }
}
