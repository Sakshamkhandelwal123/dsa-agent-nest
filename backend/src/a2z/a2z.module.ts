import { Module } from '@nestjs/common';
import { A2zService } from './a2z.service';
import { A2zController } from './a2z.controller';
import { A2Z, A2ZSchema } from './a2z.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: A2Z.name, schema: A2ZSchema }
    ])
  ],
  providers: [A2zService],
  controllers: [A2zController],
  exports: [MongooseModule]
})
export class A2zModule {}
