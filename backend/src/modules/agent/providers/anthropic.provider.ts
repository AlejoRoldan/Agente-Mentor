import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ILLMProvider } from '../../../shared/interfaces/llm-provider.interface';

/** Proveedor de LLM para Anthropic (Claude) */
@Injectable()
export class AnthropicProvider implements ILLMProvider {
  constructor(private readonly configService: ConfigService) {}

  createModel(): BaseChatModel {
    return new ChatAnthropic({
      anthropicApiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
      modelName: this.configService.get<string>(
        'ANTHROPIC_MODEL',
        'claude-sonnet-4-20250514',
      ),
      streaming: true,
      temperature: 0.7,
    });
  }

  getProviderName(): string {
    return 'anthropic';
  }
}
