import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

/** Filtro global de excepciones para WebSocket */
@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();
    const errorMessage =
      exception instanceof WsException
        ? exception.getError()
        : exception instanceof Error
          ? exception.message
          : 'Error interno del servidor';

    this.logger.error(`WebSocket error: ${JSON.stringify(errorMessage)}`);

    client.emit('error', {
      status: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
