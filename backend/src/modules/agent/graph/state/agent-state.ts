import { BaseMessage } from '@langchain/core/messages';
import { Annotation } from '@langchain/langgraph';
import {
  QueryType,
  StudentContext,
} from '../../../../shared/interfaces/llm-provider.interface';

/** Estado del agente LangGraph — define los canales del grafo */
export const AgentStateAnnotation = Annotation.Root({
  /** Historial de mensajes de la conversación */
  messages: Annotation<BaseMessage[]>({
    reducer: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
  /** Consulta actual del estudiante */
  currentQuery: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => '',
  }),
  /** Tipo de consulta clasificada */
  queryType: Annotation<QueryType>({
    reducer: (_prev, next) => next,
    default: () => 'general',
  }),
  /** Contexto del estudiante */
  studentContext: Annotation<StudentContext>({
    reducer: (_prev, next) => next,
    default: () => ({ userId: '', conversationId: '' }),
  }),
  /** Respuesta generada por el agente */
  response: Annotation<string>({
    reducer: (_prev, next) => next,
    default: () => '',
  }),
});

/** Tipo inferido del estado del agente */
export type AgentState = typeof AgentStateAnnotation.State;
