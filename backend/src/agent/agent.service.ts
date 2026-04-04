import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class AgentService {

  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private chatService: ChatService
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async askAgent(question: string) {
    const history = await this.chatService.getHistory(5);

    const formattedHistory = history
      .reverse()
      .map(
        (h, index) => `
        ${index + 1}. 
        Question: ${h.question}
        Topic: ${h.topics?.join(", ") || "general"}
        `
      )
      .join("\n");

    const prompt = `
        You are a personalized DSA learning coach.
        
        Based on user's past learning history:
        - Identify weak topics
        - Adapt explanation accordingly
        - Keep answers concise but educational
        
        User past learning history:
        ${formattedHistory}
        
        User question:
        ${question}
        
        Respond in markdown with:
        - Explanation
        - Key Concepts
        - Example (if applicable)
        - Practice Suggestion
      `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a smart DSA coach that tracks user learning progress"
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const answer = response.choices[0].message.content ?? "";

    const meta = await this.detectLearningMeta(question, answer);

    await this.chatService.saveChat({
      userId: "default",
      question,
      response: answer,
      topics: meta.topics,
      difficulty: meta.difficulty,
      concepts: meta.concepts
    });

    return answer;
  }

  async detectLearningMeta(question: string, response: string) {
    const result = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a DSA learning classifier.
            
            Return ONLY valid JSON:
            
            {
              "topics": [],
              "difficulty": "",
              "concepts": []
            }
            
            Topics must be from:
            
            array
            string
            linked-list
            stack
            queue
            tree
            graph
            heap
            recursion
            backtracking
            dp
            greedy
            binary-search
            sliding-window
            two-pointers
            
            Difficulty must be:
            
            easy
            medium
            hard
            
            Examples:
            
            Dynamic Programming question:
            {
            "topics": ["dp"],
            "difficulty": "medium",
            "concepts": ["memoization", "tabulation"]
            }
            
            Return only JSON.
          `
        },
        {
          role: "user",
          content: `
            Question:
            ${question}
            
            Response:
            ${response}
          `
        }
      ]
    });
  
    try {
      return JSON.parse(result.choices[0].message.content ?? "{}");
    } catch {
      return {
        topics: ["general"],
        difficulty: "easy",
        concepts: []
      };
    }
  }
}