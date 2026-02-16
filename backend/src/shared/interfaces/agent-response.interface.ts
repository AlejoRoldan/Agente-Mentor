import { QueryType } from './llm-provider.interface';

/** Respuesta completa del agente mentor */
export interface AgentResponse {
  /** Contenido de la respuesta generada */
  content: string;
  /** Tipo de consulta clasificada */
  queryType: QueryType;
  /** Metadatos de la respuesta */
  metadata: AgentResponseMetadata;
}

/** Metadatos asociados a la respuesta del agente */
export interface AgentResponseMetadata {
  /** Proveedor LLM utilizado */
  provider: string;
  /** Modelo utilizado */
  model: string;
  /** Latencia en milisegundos */
  latencyMs: number;
  /** Tokens estimados utilizados */
  tokensUsed?: number;
}

/** Evento de streaming token-by-token */
export interface StreamTokenEvent {
  /** Token parcial de la respuesta */
  token: string;
  /** Indica si es el último token */
  done: boolean;
}
