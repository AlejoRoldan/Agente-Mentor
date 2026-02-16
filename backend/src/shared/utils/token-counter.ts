/**
 * Estimación simple de tokens basada en la regla ~4 caracteres = 1 token.
 * Para producción, usar tiktoken o la API del proveedor.
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/** Límites de tokens por modelo */
export const MODEL_TOKEN_LIMITS: Record<string, number> = {
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'claude-sonnet-4-20250514': 200000,
  'claude-3-haiku-20240307': 200000,
};

/**
 * Verifica si el texto excede el límite de tokens del modelo.
 * Retorna true si está dentro del límite.
 */
export function isWithinTokenLimit(
  text: string,
  model: string,
): boolean {
  const limit = MODEL_TOKEN_LIMITS[model] || 128000;
  return estimateTokenCount(text) < limit;
}
