import { InternalServerErrorException } from '@nestjs/common';

export class FailedToIncreaseByException extends InternalServerErrorException {
  private constructor(message: string) {
    super(message, 'FailedToIncreaseByException');
  }

  static fromError(error: Error) {
    const errorMessage = `Failed to "increase by" redis value: ${error.message}`;
    return new this(errorMessage);
  }
}
