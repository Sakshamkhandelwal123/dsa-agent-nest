import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { SuggestionService } from 'src/suggestion/suggestion.service';

@Module({
  providers: [AgentService, SuggestionService],
  controllers: [AgentController]
})
export class AgentModule {}
