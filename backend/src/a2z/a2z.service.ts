import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { A2Z } from "./a2z.schema";

@Injectable()
export class A2zService {

  constructor(
    @InjectModel(A2Z.name)
    private a2zModel: Model<A2Z>
  ) {}

  async getAll() {
    return this.a2zModel.find();
  }

  async getByTopic(topic: string) {
    return this.a2zModel.find({
      subcategory: topic
    });
  }

  async getRandom() {

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

}