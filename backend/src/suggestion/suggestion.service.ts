import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { A2Z } from '../a2z/a2z.schema';

@Injectable()
export class SuggestionService {

  constructor(
    @InjectModel(A2Z.name)
    private a2zModel: Model<A2Z>
  ) { }

  async suggestRandom() {

    const count =
      await this.a2zModel.countDocuments();

    const random =
      Math.floor(Math.random() * count);

    const question =
      await this.a2zModel
        .findOne()
        .skip(random);

    return {
      topic: question?.category,
      question: question?.problemName,
      difficulty: question?.difficulty,
      leetcode: question?.leetcode
    };

  }

  async suggestFromInsights(insights: any) {

    const topic =
      insights?.mostAsked ||
      insights?.recentFocus?.[0];

    if (!topic) {
      return this.suggestRandom();
    }

    const questions =
      await this.a2zModel.find({
        category: topic
      });

    if (!questions.length) {
      return this.suggestRandom();
    }

    const random =
      questions[Math.floor(Math.random() * questions.length)];

    return {
      topic: random.category,
      question: random.problemName,
      difficulty: random.difficulty,
      leetcode: random.leetcode
    };

  }

}