import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/** Crea y configura la conexión Socket.io al backend */
export function createSocket(token: string): Socket {
  return io(`${BACKEND_URL}/chat`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });
}

/** URL base de la API REST */
export const API_URL = `${BACKEND_URL}/api`;
