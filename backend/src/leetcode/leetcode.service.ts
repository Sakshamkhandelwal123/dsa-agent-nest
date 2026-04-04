import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LeetcodeService {

  async getUserStats(username: string) {

    const response = await axios.post(
      'https://leetcode.com/graphql',
      {
        query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            profile {
              ranking
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
        `,
        variables: {
          username
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const user = response.data.data.matchedUser;

    const stats =
      user.submitStats.acSubmissionNum;

    return {
      totalSolved: stats[0].count,
      easySolved: stats[1].count,
      mediumSolved: stats[2].count,
      hardSolved: stats[3].count,
      ranking: user.profile.ranking
    };
  }

  async getRecentSubmissions(username: string) {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `
        query recentSubmissions($username: String!) {
          recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
          }
        }
        `,
        variables: {
          username
        }
      }
    );
  
    return response.data.data.recentSubmissionList;
  }
}