import { Injectable } from '@nestjs/common';
import { RedisClientWrapperService } from './redis-client-wrapper.service';
import { TrackRequestDto } from '../track/dto/track-request.dto';
import { RedisKey } from './redis-key.enum';

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

  async getCount(): Promise<number | null> {
    const count = await this.redisClientService.get(RedisKey.COUNT);
    return count ? parseInt(count, 10) : null;
  }
}
