import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigService } from './redis-config.service';
import { RedisClientWrapperService } from './redis-client-wrapper.service';
import { RedisFacadeService } from './redis-facade.service';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisConfigService,
    RedisClientWrapperService,
    RedisFacadeService,
  ],
  exports: [RedisConfigService, RedisClientWrapperService, RedisFacadeService],
})
export class RedisModule {}
