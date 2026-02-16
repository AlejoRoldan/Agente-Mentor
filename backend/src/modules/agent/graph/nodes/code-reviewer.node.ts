import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';
import { MENTOR_SYSTEM_PROMPT } from '../../prompts/system-prompt';
import { REVIEW_CODE_TEMPLATE } from '../../prompts/templates/review-code';

/**
 * Nodo de revisión de código — analiza código del estudiante
 * con enfoque pedagógico (primero lo positivo, luego mejoras).
 */
export function createCodeReviewerNode(llm: BaseChatModel) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    const { currentQuery, studentContext, messages } = state;

    const reviewContext = REVIEW_CODE_TEMPLATE.replace(
      '{query}',
      currentQuery,
    )
      .replace('{bootcamp}', studentContext.bootcamp || 'No especificado')
      .replace(
        '{currentWeek}',
        String(studentContext.currentWeek || 'No especificada'),
      );

    const chatMessages = [
      new SystemMessage(`${MENTOR_SYSTEM_PROMPT}\n\n${reviewContext}`),
      ...messages.slice(-10),
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
