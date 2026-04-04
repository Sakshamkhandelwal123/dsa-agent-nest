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
}