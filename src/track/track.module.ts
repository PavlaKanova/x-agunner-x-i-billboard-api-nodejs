import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FileModule } from '../file/file.module';
import { DirectoryLocationModule } from '../directory-location/directory-location.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [FileModule, DirectoryLocationModule],
})
export class TrackModule {}
