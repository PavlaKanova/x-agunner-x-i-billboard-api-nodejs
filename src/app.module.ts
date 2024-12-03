import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';
import { FileModule } from './component/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { DirectoryLocationModule } from './component/directory-location/directory-location.module';
import { RedisModule } from './component/redis/redis.module';
import { WinstonLoggerService } from './component/logger/winston-logger.service';
import { CountModule } from './count/count.module';

@Module({
  imports: [
    TrackModule,
    FileModule,
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env.global'] }),
    DirectoryLocationModule,
    RedisModule,
    CountModule,
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
