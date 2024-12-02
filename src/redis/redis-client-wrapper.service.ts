import { Injectable } from '@nestjs/common';
import { RedisConfigService } from './redis-config.service';
import { createClient, RedisClientType } from 'redis';
import { FailedToIncreaseByException } from './exception/failed-to-increase-by.exception';
import { FailedToGetValueException } from './exception/failed-to-get-value.exception';

@Injectable()
export class RedisClientWrapperService {
  private client: RedisClientType;

  constructor(private readonly redisConfigService: RedisConfigService) {
    this.client = createClient({
      url: redisConfigService.url,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.disconnect();
  }

  async increaseBy(key: string, value: number): Promise<void> {
    try {
      await this.client.incrBy(key, value);
    } catch (error) {
      throw FailedToIncreaseByException.fromError(error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return this.client.get(key);
    } catch (error) {
      throw FailedToGetValueException.fromError(error);
    }
  }
}
