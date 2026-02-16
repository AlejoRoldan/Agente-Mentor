import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';

const SUMMARIZER_PROMPT = `Resume la siguiente conversación de forma concisa, 
manteniendo los puntos técnicos clave y el progreso del estudiante. 
El resumen será usado como contexto para continuar la conversación.
Máximo 200 palabras.`;

/**
 * Nodo resumidor — comprime el contexto cuando la conversación es muy larga.
 * Se usa para mantener el historial dentro de los límites de tokens.
 */
export function createSummarizerNode(llm: BaseChatModel) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    const { messages } = state;

    if (messages.length < 20) {
      return {};
    }

    const conversationText = messages
      .map((m) => {
        const role =
          m._getType() === 'human' ? 'Estudiante' : 'Mentor';
        return `${role}: ${typeof m.content === 'string' ? m.content : ''}`;
      })
      .join('\n');

    const response = await llm.invoke([
      new SystemMessage(SUMMARIZER_PROMPT),
      new HumanMessage(conversationText),
    ]);

    const summary =
      typeof response.content === 'string' ? response.content : '';

    return {
      response: summary,
    };
  };
}
