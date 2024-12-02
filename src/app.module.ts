import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';
import { DirectoryLocationModule } from './directory-location/directory-location.module';
import { RedisModule } from './redis/redis.module';
import { WinstonLoggerService } from './logger/winston-logger.service';

@Module({
  imports: [
    TrackModule,
    FileModule,
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env.global'] }),
    DirectoryLocationModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WinstonLoggerService,
    {
      provide: 'WinstonLogger',
      useFactory: (winstonLoggerService: WinstonLoggerService) =>
        winstonLoggerService.createLogger(),
      inject: [WinstonLoggerService],
    },
  ],
})
export class AppModule {}
