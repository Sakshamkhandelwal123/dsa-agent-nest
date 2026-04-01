import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';

@Controller('leetcode')
export class LeetcodeController {
  constructor(private leetcodeService: LeetcodeService) {}

  @Get('stats')
  async getStats(@Query('username') username?: string) {
    const u = username?.trim() || process.env.LEETCODE_USERNAME;
    if (!u) {
      throw new BadRequestException('Query parameter "username" is required');
    }
    return this.leetcodeService.getUserStats(u);
  }
}
