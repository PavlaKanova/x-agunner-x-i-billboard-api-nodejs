import { Injectable } from '@nestjs/common';
import { RedisConfigService } from './redis-config.service';
import { createClient, RedisClientType } from 'redis';
import { FailedToIncreaseByException } from './exception/failed-to-increase-by.exception';
import { FailedToGetValueException } from './exception/failed-to-get-value.exception';
import { IncrementCountStorage } from '../../track/increment-count-storage.interface';
import { RedisKey } from './redis-key.enum';
import { CountIsNotANumberException } from './exception/count-is-not-a-number.exception';
import { GetCountStorage } from '../../track/get-count-storage.interface';

// REVIEW public/private
@Injectable()
export class RedisClientWrapperService
  implements IncrementCountStorage, GetCountStorage
{
  private client: RedisClientType;

  constructor(private readonly redisConfigService: RedisConfigService) {
    // redisConfigService nemusí být na thisu.
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

  async incrementCount(value: number): Promise<void> {
    try {
      await this.client.incrBy(RedisKey.COUNT, value);
    } catch (error) {
      throw FailedToIncreaseByException.fromError(error);
    }
  }

  async getCount(): Promise<number> {
    // REVIEW: Dalo by se napsat bez letu.
    let count: string | null = null;

    try {
      count = await this.client.get(RedisKey.COUNT);
    } catch (error) {
      throw FailedToGetValueException.fromError(error);
    }

    const parsedCount = count ? parseInt(count, 10) : 0;
    if (isNaN(parsedCount)) {
      throw CountIsNotANumberException.create();
    }

    return parsedCount;
  }
}
