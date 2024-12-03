import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    const host = this.configService.get<string>('REDIS_HOST', { infer: true });
    if (!host) {
      throw new Error('REDIS_HOST is not defined');
    }
    return host;
  }

  get port(): number {
    const port = this.configService.get<number>('REDIS_PORT', { infer: true });
    if (!port) {
      throw new Error('REDIS_PORT is not defined');
    }
    return port;
  }

  get url(): string {
    return `${this.host}://${this.host}:${this.port}`;
  }
}
