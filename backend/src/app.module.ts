import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeetcodeModule } from './leetcode/leetcode.module';
import { A2zModule } from './a2z/a2z.module';
import { AgentModule } from './agent/agent.module';
import { SuggestionModule } from './suggestion/suggestion.module';
import { ReminderModule } from './reminder/reminder.module';
import { NotionModule } from './notion/notion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '..', '.env'),
        resolve(process.cwd(), '.env'),
      ],
    }),
    LeetcodeModule,
    A2zModule,
    AgentModule,
    SuggestionModule,
    ReminderModule,
    NotionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
