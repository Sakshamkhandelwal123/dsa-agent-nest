import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type A2ZDocument = A2Z & Document;

@Schema({ timestamps: true })
export class A2Z {

  @Prop({ unique: true })
  problemId: number;

  @Prop()
  problemName: string;

  @Prop()
  category: string;

  @Prop()
  subcategory: string;

  @Prop()
  difficulty: string;

  @Prop()
  article: string;

  @Prop()
  youtube: string;

  @Prop()
  leetcode: string;

}

export const A2ZSchema = SchemaFactory.createForClass(A2Z);