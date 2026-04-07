import { Controller, Get, Query } from '@nestjs/common';
import { AgentService } from './agent.service';
import { SuggestionService } from '../suggestion/suggestion.service';
import { ChatService } from 'src/chat/chat.service';

@Controller('agent')
export class AgentController {
  constructor(
    private agentService: AgentService,
    private suggestionService: SuggestionService,
    private chatService: ChatService
  ) { }

  @Get('suggest')
  async suggest() {
    const insights =
      await this.chatService.getLearningInsights();
  
    return this.suggestionService
      .suggestFromInsights(insights);
  }

  @Get('ask')
  async ask(@Query('q') q: string) {
    return this.agentService.askAgent(q);
  }

  @Get("insights")
  async getInsights() {
    return this.chatService.getLearningInsights();
  }
}