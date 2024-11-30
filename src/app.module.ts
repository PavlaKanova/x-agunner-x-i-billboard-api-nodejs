import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [TrackModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
