import { Module } from '@nestjs/common';
import { CountController } from './count.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [CountController],
  imports: [RedisModule],
})
export class CountModule {}
