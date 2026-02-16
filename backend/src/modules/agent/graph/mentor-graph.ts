import { StateGraph, END } from '@langchain/langgraph';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AgentStateAnnotation, AgentState } from './state/agent-state';
import { createClassifierNode } from './nodes/classifier.node';
import { createResponderNode } from './nodes/responder.node';
import { createCodeReviewerNode } from './nodes/code-reviewer.node';

/**
 * Construye el grafo LangGraph del mentor AI.
 *
 * Flujo:
 * [Input] → [Classifier] → ¿Tipo?
 *   ├── concept    → [Responder] → [Output]
 *   ├── code_review → [CodeReviewer] → [Output]
 *   ├── exercise   → [Responder] → [Output]
 *   └── general    → [Responder] → [Output]
 */
export function buildMentorGraph(llm: BaseChatModel) {
  const classifierNode = createClassifierNode(llm);
  const responderNode = createResponderNode(llm);
  const codeReviewerNode = createCodeReviewerNode(llm);

  const graph = new StateGraph(AgentStateAnnotation)
    .addNode('classifier', classifierNode)
    .addNode('responder', responderNode)
    .addNode('code_reviewer', codeReviewerNode)
    .addEdge('__start__', 'classifier')
    .addConditionalEdges('classifier', routeByQueryType)
    .addEdge('responder', END)
    .addEdge('code_reviewer', END);

  return graph.compile();
}

/** Función de enrutamiento condicional basada en el tipo de consulta */
function routeByQueryType(state: AgentState): string {
  switch (state.queryType) {
    case 'code_review':
      return 'code_reviewer';
    case 'concept':
    case 'exercise':
    case 'general':
    default:
      return 'responder';
  }
}
