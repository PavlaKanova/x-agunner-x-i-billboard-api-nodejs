import { Controller, Get } from '@nestjs/common';
import { CountService } from './count.service';

@Controller('count')
export class CountController {
  constructor(readonly countService: CountService) {}

  @Get()
  async count(): Promise<number> {
    return await this.countService.getCount();
  }
}
