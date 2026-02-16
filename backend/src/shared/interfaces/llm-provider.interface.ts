import { BaseChatModel } from '@langchain/core/language_models/chat_models';

/** Interfaz para proveedores de LLM */
export interface ILLMProvider {
  /** Crea una instancia del modelo de chat configurado */
  createModel(): BaseChatModel;
  /** Nombre del proveedor */
  getProviderName(): string;
}

/** Tipos de consulta que el agente puede clasificar */
export type QueryType = 'concept' | 'code_review' | 'exercise' | 'general';

/** Contexto del estudiante durante la conversación */
export interface StudentContext {
  userId: string;
  conversationId: string;
  bootcamp?: string;
  currentWeek?: number;
}
