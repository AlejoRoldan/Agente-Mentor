import { Injectable, Logger } from '@nestjs/common';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { LLMProviderFactory } from './providers/llm-provider.factory';
import { buildMentorGraph } from './graph/mentor-graph';
import {
  AgentResponse,
  StreamTokenEvent,
} from '../../shared/interfaces/agent-response.interface';
import {
  QueryType,
  StudentContext,
} from '../../shared/interfaces/llm-provider.interface';
import { estimateTokenCount } from '../../shared/utils/token-counter';

/** Callback para streaming de tokens */
export type StreamCallback = (event: StreamTokenEvent) => void;

/**
 * Servicio principal del agente mentor.
 * Orquesta el grafo LangGraph y gestiona el streaming de respuestas.
 */
@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(private readonly llmFactory: LLMProviderFactory) {}

  /**
   * Procesa un mensaje del estudiante y retorna la respuesta completa.
   * Usado cuando no se necesita streaming.
   */
  async processMessage(
    query: string,
    studentContext: StudentContext,
    messageHistory: BaseMessage[] = [],
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const llm = this.llmFactory.create();
    const graph = buildMentorGraph(llm);

    this.logger.log(
      `Procesando mensaje para usuario ${studentContext.userId} en conversación ${studentContext.conversationId}`,
    );

    const result = await graph.invoke({
      messages: messageHistory,
      currentQuery: query,
      queryType: 'general' as QueryType,
      studentContext,
      response: '',
    });

    const latencyMs = Date.now() - startTime;

    this.logger.log(
      `Respuesta generada en ${latencyMs}ms — tipo: ${result.queryType}`,
    );

    return {
      content: result.response,
      queryType: result.queryType,
      metadata: {
        provider: this.llmFactory.getActiveProvider(),
        model: this.llmFactory.getActiveModel(),
        latencyMs,
        tokensUsed: estimateTokenCount(result.response),
      },
    };
  }

  /**
   * Procesa un mensaje con streaming token-by-token.
   * Emite tokens parciales via callback para envío por WebSocket.
   */
  async processMessageWithStreaming(
    query: string,
    studentContext: StudentContext,
    messageHistory: BaseMessage[] = [],
    onToken: StreamCallback,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const llm = this.llmFactory.create();
    const graph = buildMentorGraph(llm);

    this.logger.log(
      `Procesando mensaje (streaming) para usuario ${studentContext.userId}`,
    );

    let fullResponse = '';
    let queryType: QueryType = 'general';

    const stream = await graph.stream(
      {
        messages: messageHistory,
        currentQuery: query,
        queryType: 'general' as QueryType,
        studentContext,
        response: '',
      },
      { streamMode: 'updates' },
    );

    for await (const chunk of stream) {
      // Cada chunk es un objeto con el nombre del nodo como key
      for (const [nodeName, nodeOutput] of Object.entries(chunk)) {
        const output = nodeOutput as Record<string, unknown>;

        if (nodeName === 'classifier' && output.queryType) {
          queryType = output.queryType as QueryType;
        }

        if (output.response && typeof output.response === 'string') {
          const newContent = output.response;
          // Emitir la respuesta en chunks simulando streaming
          const words = newContent.split(' ');
          for (let i = 0; i < words.length; i++) {
            const token = (i > 0 ? ' ' : '') + words[i];
            fullResponse += token;
            onToken({ token, done: false });
            // Pequeña pausa para efecto de streaming visual
            await new Promise((resolve) => setTimeout(resolve, 15));
          }
        }
      }
    }

    onToken({ token: '', done: true });

    const latencyMs = Date.now() - startTime;

    this.logger.log(
      `Streaming completado en ${latencyMs}ms — tipo: ${queryType}`,
    );

    return {
      content: fullResponse,
      queryType,
      metadata: {
        provider: this.llmFactory.getActiveProvider(),
        model: this.llmFactory.getActiveModel(),
        latencyMs,
        tokensUsed: estimateTokenCount(fullResponse),
      },
    };
  }

  /**
   * Convierte mensajes de la DB al formato de LangChain.
   */
  convertToLangChainMessages(
    messages: Array<{ role: string; content: string }>,
  ): BaseMessage[] {
    return messages.map((msg) => {
      if (msg.role === 'USER') {
        return new HumanMessage(msg.content);
      }
      return new AIMessage(msg.content);
    });
  }
}
