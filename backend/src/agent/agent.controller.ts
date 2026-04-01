import { Controller, Get, Query } from '@nestjs/common';
import { AgentService } from './agent.service';
import { SuggestionService } from '../suggestion/suggestion.service';

@Controller('agent')
export class AgentController {

  constructor(
    private agentService: AgentService,
    private suggestionService: SuggestionService
  ) {}

  @Get('suggest')

  suggest() {
    return this.suggestionService.suggestRandom();
  }

  @Get('ask')

  async ask(@Query('q') q: string) {
    return this.agentService.askAgent(q);
  }

}