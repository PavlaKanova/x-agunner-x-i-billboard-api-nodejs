import { Injectable } from '@nestjs/common';
import { RedisClientWrapperService } from './redis-client-wrapper.service';
import { TrackRequestDto } from '../track/dto/track-request.dto';
import { RedisKey } from './redis-key.enum';
import { CountIsNotANumberException } from './count-is-not-a-number.exception';

@Injectable()
export class RedisFacadeService {
  constructor(private readonly redisClientService: RedisClientWrapperService) {}

  async appendCount(trackRequestDto: TrackRequestDto): Promise<void> {
    if (typeof trackRequestDto.count === 'number') {
      await this.redisClientService.increaseBy(
        RedisKey.COUNT,
        trackRequestDto.count,
      );
    }
  }

  async getCount(): Promise<number> {
    const count = await this.redisClientService.get(RedisKey.COUNT);

    const parsedCount = count ? parseInt(count, 10) : 0;
    if (isNaN(parsedCount)) {
      throw CountIsNotANumberException.create();
    }

    return parsedCount;
  }
}
