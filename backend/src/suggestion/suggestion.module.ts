import { Module } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { A2zModule } from 'src/a2z/a2z.module';

@Module({
  imports: [A2zModule],
  providers: [SuggestionService],
  exports: [SuggestionService]
})
export class SuggestionModule {}
