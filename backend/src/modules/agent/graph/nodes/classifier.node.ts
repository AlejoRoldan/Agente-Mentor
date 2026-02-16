import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { AgentState } from '../state/agent-state';
import { QueryType } from '../../../../shared/interfaces/llm-provider.interface';

const CLASSIFIER_PROMPT = `Eres un clasificador de intenciones para un tutor de programación.
Clasifica la consulta del estudiante en UNA de estas categorías:

- "concept": El estudiante pregunta sobre un concepto teórico (qué es, cómo funciona, para qué sirve)
- "code_review": El estudiante comparte código para revisión o tiene un error/bug
- "exercise": El estudiante pide ayuda con un ejercicio práctico o proyecto
- "general": Saludo, pregunta general, o conversación no técnica

Responde SOLO con la categoría, sin explicación. Ejemplo: concept`;

/**
 * Nodo clasificador — determina el tipo de consulta del estudiante.
 * Usa el LLM para clasificar la intención.
 */
export function createClassifierNode(llm: BaseChatModel) {
  return async (state: AgentState): Promise<Partial<AgentState>> => {
    const query = state.currentQuery;

    try {
      const response = await llm.invoke([
        new SystemMessage(CLASSIFIER_PROMPT),
        new HumanMessage(query),
      ]);

      const classification = (
        typeof response.content === 'string'
          ? response.content
          : ''
      )
        .trim()
        .toLowerCase() as QueryType;

      const validTypes: QueryType[] = [
        'concept',
        'code_review',
        'exercise',
        'general',
      ];
      const queryType = validTypes.includes(classification)
        ? classification
        : 'general';

      return { queryType };
    } catch {
      // Fallback: clasificación heurística si el LLM falla
      return { queryType: classifyByHeuristic(query) };
    }
  };
}

/** Clasificación heurística como fallback */
function classifyByHeuristic(query: string): QueryType {
  const lower = query.toLowerCase();

  const codePatterns = [
    /```/,
    /function\s/,
    /const\s/,
    /let\s/,
    /var\s/,
    /error/i,
    /bug/i,
    /no funciona/i,
    /no me funciona/i,
    /revisar/i,
    /review/i,
  ];
  if (codePatterns.some((p) => p.test(lower))) return 'code_review';

  const conceptPatterns = [
    /qué es/i,
    /what is/i,
    /cómo funciona/i,
    /how does/i,
    /para qué/i,
    /explica/i,
    /explain/i,
    /diferencia entre/i,
  ];
  if (conceptPatterns.some((p) => p.test(lower))) return 'concept';

  const exercisePatterns = [
    /ejercicio/i,
    /exercise/i,
    /proyecto/i,
    /project/i,
    /cómo hago/i,
    /how do i/i,
    /implementar/i,
    /crear/i,
    /build/i,
  ];
  if (exercisePatterns.some((p) => p.test(lower))) return 'exercise';

  return 'general';
}
