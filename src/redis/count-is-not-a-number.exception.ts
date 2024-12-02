import { InternalServerErrorException } from '@nestjs/common';
import { RedisKey } from './redis-key.enum';

export class CountIsNotANumberException extends InternalServerErrorException {
  private constructor() {
    super(
      `Redis value of "${RedisKey.COUNT}" key is not a number`,
      'CountIsNotANumberException',
    );
  }

  static create() {
    return new this();
  }
}
