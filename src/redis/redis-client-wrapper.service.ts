import { Injectable } from '@nestjs/common';
import { RedisConfigService } from './redis-config.service';
import { createClient, RedisClientType } from 'redis';

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
    await this.client.incrBy(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
