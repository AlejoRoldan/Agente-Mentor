import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentService } from './agent.service';
import { LLMProviderFactory } from './providers/llm-provider.factory';
import { OpenAIProvider } from './providers/openai.provider';
import { AnthropicProvider } from './providers/anthropic.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    AgentService,
    LLMProviderFactory,
    OpenAIProvider,
    AnthropicProvider,
  ],
  exports: [AgentService, LLMProviderFactory],
})
export class AgentModule {}
