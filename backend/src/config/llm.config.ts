import { registerAs } from '@nestjs/config';

/** Configuración multi-provider para LLM (OpenAI / Anthropic) */
export const llmConfig = registerAs('llm', () => ({
  provider: process.env.LLM_PROVIDER || 'openai',
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
  },
}));
