import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { OpenAIProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';

/** Factory para crear instancias de LLM según configuración */
@Injectable()
export class LLMProviderFactory {
  private readonly logger = new Logger(LLMProviderFactory.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly openaiProvider: OpenAIProvider,
    private readonly anthropicProvider: AnthropicProvider,
  ) {}

  /**
   * Crea una instancia del modelo de chat según el proveedor configurado.
   * Se puede sobreescribir el proveedor pasando el parámetro.
   */
  create(provider?: string): BaseChatModel {
    const selectedProvider =
      provider || this.configService.get<string>('LLM_PROVIDER', 'openai');

    this.logger.log(`Creando modelo LLM con proveedor: ${selectedProvider}`);

    switch (selectedProvider) {
      case 'openai':
        return this.openaiProvider.createModel();
      case 'anthropic':
        return this.anthropicProvider.createModel();
      default:
        throw new Error(`Proveedor LLM no soportado: ${selectedProvider}`);
    }
  }

  /** Retorna el nombre del proveedor activo */
  getActiveProvider(): string {
    return this.configService.get<string>('LLM_PROVIDER', 'openai');
  }

  /** Retorna el nombre del modelo activo */
  getActiveModel(): string {
    const provider = this.getActiveProvider();
    if (provider === 'openai') {
      return this.configService.get<string>('OPENAI_MODEL', 'gpt-4o');
    }
    return this.configService.get<string>(
      'ANTHROPIC_MODEL',
      'claude-sonnet-4-20250514',
    );
  }
}
