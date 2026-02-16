import * as Joi from 'joi';

/** Esquema de validación para variables de entorno */
export const envValidationSchema = Joi.object({
  // Server
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // LLM Configuration
  LLM_PROVIDER: Joi.string().valid('openai', 'anthropic').default('openai'),
  OPENAI_API_KEY: Joi.string().when('LLM_PROVIDER', {
    is: 'openai',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  OPENAI_MODEL: Joi.string().default('gpt-4o'),
  ANTHROPIC_API_KEY: Joi.string().when('LLM_PROVIDER', {
    is: 'anthropic',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  ANTHROPIC_MODEL: Joi.string().default('claude-sonnet-4-20250514'),

  // Auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('24h'),

  // WebSocket
  WS_CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
});
