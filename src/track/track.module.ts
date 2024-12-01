import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FileModule } from '../file/file.module';
import { DirectoryLocationModule } from '../directory-location/directory-location.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [FileModule, DirectoryLocationModule, RedisModule],
})
export class TrackModule {}
