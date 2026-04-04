import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop()
  userId: string;

  @Prop()
  question: string;

  @Prop()
  response: string;

  @Prop([String])
  topics: string[];

  @Prop()
  difficulty: string;

  @Prop([String])
  concepts: string[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);