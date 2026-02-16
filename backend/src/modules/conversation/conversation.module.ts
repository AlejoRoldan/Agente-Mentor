import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { DatabaseService } from '../../config/database.config';

@Module({
  providers: [ConversationService, DatabaseService],
  exports: [ConversationService],
})
export class ConversationModule {}
