import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeetcodeModule } from './leetcode/leetcode.module';
import { A2zModule } from './a2z/a2z.module';
import { AgentModule } from './agent/agent.module';
import { SuggestionModule } from './suggestion/suggestion.module';
import { ReminderModule } from './reminder/reminder.module';
import { NotionModule } from './notion/notion.module';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '..', '.env'),
        resolve(process.cwd(), '.env'),
      ],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        if (!mongoUri) {
          throw new Error('MONGO_URI is required');
        }
        return { uri: mongoUri };
      },
    }),
    LeetcodeModule,
    A2zModule,
    AgentModule,
    SuggestionModule,
    ReminderModule,
    NotionModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
