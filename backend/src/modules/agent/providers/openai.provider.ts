import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ILLMProvider } from '../../../shared/interfaces/llm-provider.interface';

/** Proveedor de LLM para OpenAI */
@Injectable()
export class OpenAIProvider implements ILLMProvider {
  constructor(private readonly configService: ConfigService) {}

  createModel(): BaseChatModel {
    return new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: this.configService.get<string>('OPENAI_MODEL', 'gpt-4o'),
      streaming: true,
      temperature: 0.7,
    });
  }

  getProviderName(): string {
    return 'openai';
  }
}
