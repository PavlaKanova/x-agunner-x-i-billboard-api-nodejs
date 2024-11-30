import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [FileModule],
})
export class TrackModule {}
