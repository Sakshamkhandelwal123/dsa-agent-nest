import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { SuggestionService } from 'src/suggestion/suggestion.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [AgentService, SuggestionService],
  controllers: [AgentController]
})
export class AgentModule {}
