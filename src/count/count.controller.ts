import { Controller, Get } from '@nestjs/common';
import { RedisFacadeService } from '../redis/redis-facade.service';

@Controller('count')
export class CountController {
  constructor(readonly redisFacadeService: RedisFacadeService) {}

  @Get()
  async count(): Promise<number> {
    return await this.redisFacadeService.getCount();
  }
}
