import { Injectable } from '@nestjs/common';
import { A2Z_DATA } from '../a2z/a2z.data';

@Injectable()
export class SuggestionService {

  suggestRandom() {

    const topics = Object.keys(A2Z_DATA);

    const topic =
      topics[Math.floor(Math.random() * topics.length)];

    const questions = A2Z_DATA[topic];

    const question =
      questions[Math.floor(Math.random() * questions.length)];

    return {
      topic,
      question
    };
  }

}