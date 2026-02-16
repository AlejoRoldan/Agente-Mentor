import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard JWT para proteger endpoints REST */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/** Guard JWT para proteger WebSocket gateways */
@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    // El token se envía en el handshake del WebSocket
    return {
      headers: {
        authorization: client.handshake?.auth?.token
          ? `Bearer ${client.handshake.auth.token}`
          : client.handshake?.headers?.authorization,
      },
    };
  }
}
