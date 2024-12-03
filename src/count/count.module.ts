import { Module } from '@nestjs/common';
import { CountController } from './count.controller';
import { RedisModule } from '../component/redis/redis.module';
import { CountService } from './count.service';
import { RedisClientWrapperService } from '../component/redis/redis-client-wrapper.service';
import { GET_COUNT_STORAGE } from '../track/get-count-storage.interface';

@Module({
  controllers: [CountController],
  imports: [RedisModule],
  providers: [
    CountService,
    {
      provide: GET_COUNT_STORAGE,
      useClass: RedisClientWrapperService,
    },
  ],
})
export class CountModule {}
