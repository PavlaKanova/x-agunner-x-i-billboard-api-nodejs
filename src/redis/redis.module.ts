import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';
import { RedisClientWrapperService } from './redis-client-wrapper.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisConfigService, RedisClientWrapperService],
  exports: [RedisConfigService, RedisClientWrapperService],
})
export class RedisModule {}
