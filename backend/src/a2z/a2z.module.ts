import { Module } from '@nestjs/common';
import { A2zService } from './a2z.service';

@Module({
  providers: [A2zService]
})
export class A2zModule {}
