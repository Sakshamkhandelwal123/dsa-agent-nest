import { Controller, Get } from '@nestjs/common';
import { A2zService } from './a2z.service';

@Controller('a2z')
export class A2zController {
    constructor(
        private a2zService: A2zService
    ) {}
    @Get()
    getAll() {
        return this.a2zService.getAll();
    }

    @Get("random")
    getRandom() {
        return this.a2zService.getRandom();
    }
}
