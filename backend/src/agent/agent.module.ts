import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { ChatModule } from 'src/chat/chat.module';
import { SuggestionModule } from 'src/suggestion/suggestion.module';

@Module({
  imports: [ChatModule, SuggestionModule],
  providers: [AgentService],
  controllers: [AgentController]
})
export class AgentModule {}
