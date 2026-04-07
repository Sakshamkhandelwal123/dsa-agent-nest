import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './chat.schema';

@Injectable()
export class ChatService {

  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDocument>
  ) {}

  async saveChat(data: Partial<Chat>) {
    return this.chatModel.create(data);
  }

  async getHistory(limit=5) {
    return this.chatModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getLearningInsights() {
    const chats = await this.chatModel.find();
  
    const topicCount = {};
    const difficultyCount = {};
  
    chats.forEach(chat => {
      chat.topics?.forEach(topic => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
  
      if (chat.difficulty) {
        difficultyCount[chat.difficulty] =
          (difficultyCount[chat.difficulty] || 0) + 1;
      }
    });
  
    const sortedTopics = Object.entries(topicCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([topic]) => topic);
  
    return {
      totalQuestions: chats.length,
      recentFocus: sortedTopics.slice(0, 3),
      mostAsked: sortedTopics[0] || null,
      difficultyBreakdown: difficultyCount
    };
  }
}