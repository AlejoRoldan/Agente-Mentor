import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService } from '../../config/database.config';

@Module({
  providers: [UserService, DatabaseService],
  exports: [UserService],
})
export class UserModule {}
