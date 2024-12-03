import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FileModule } from '../file/file.module';
import { RedisModule } from '../redis/redis.module';
import { RedisClientWrapperService } from '../redis/redis-client-wrapper.service';
import { INCREMENT_COUNT_STORAGE } from './increment-count-storage.interface';
import { REQUEST_CONTENT_STORAGE } from './request-content-storage.interface';
import { FileService } from '../file/file.service';

@Module({
  controllers: [TrackController],
  providers: [
    TrackService,
    {
      provide: INCREMENT_COUNT_STORAGE,
      useClass: RedisClientWrapperService,
    },
    {
      provide: REQUEST_CONTENT_STORAGE,
      useClass: FileService,
    },
  ],
  imports: [FileModule, RedisModule],
})
export class TrackModule {}
