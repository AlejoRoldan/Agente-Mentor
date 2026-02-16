import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';
import { MENTOR_SYSTEM_PROMPT } from '../../prompts/system-prompt';
import { EXPLAIN_CONCEPT_TEMPLATE } from '../../prompts/templates/explain-concept';
import { GUIDE_EXERCISE_TEMPLATE } from '../../prompts/templates/guide-exercise';

/**
 * Nodo respondedor — genera la respuesta pedagógica del mentor.
 * Selecciona el template según el tipo de consulta clasificada.
 */
export function createResponderNode(llm: BaseChatModel) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    const { currentQuery, queryType, studentContext, messages } = state;

    let additionalContext = '';
    if (queryType === 'concept') {
      additionalContext = EXPLAIN_CONCEPT_TEMPLATE.replace(
        '{query}',
        currentQuery,
      )
        .replace('{bootcamp}', studentContext.bootcamp || 'No especificado')
        .replace(
          '{currentWeek}',
          String(studentContext.currentWeek || 'No especificada'),
        );
    } else if (queryType === 'exercise') {
      additionalContext = GUIDE_EXERCISE_TEMPLATE.replace(
        '{query}',
        currentQuery,
      )
        .replace('{bootcamp}', studentContext.bootcamp || 'No especificado')
        .replace(
          '{currentWeek}',
          String(studentContext.currentWeek || 'No especificada'),
        );
    }

    const systemContent = additionalContext
      ? `${MENTOR_SYSTEM_PROMPT}\n\n${additionalContext}`
      : MENTOR_SYSTEM_PROMPT;

    // Construir mensajes con historial reciente
    const chatMessages = [
      new SystemMessage(systemContent),
      ...messages.slice(-10), // Últimos 10 mensajes como contexto
      new HumanMessage(currentQuery),
    ];

    const response = await llm.invoke(chatMessages);
    const content =
      typeof response.content === 'string' ? response.content : '';

    return {
      response: content,
      messages: [new AIMessage(content)],
    };
  };
}
