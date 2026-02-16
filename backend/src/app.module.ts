import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { llmConfig } from './config/llm.config';
import { DatabaseService } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { AgentModule } from './modules/agent/agent.module';
import { ConversationModule } from './modules/conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [llmConfig],
    }),
    AuthModule,
    UserModule,
    ChatModule,
    AgentModule,
    ConversationModule,
  ],
  providers: [DatabaseService],
})
export class AppModule {}
