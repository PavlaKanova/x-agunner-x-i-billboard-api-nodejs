import { InternalServerErrorException } from '@nestjs/common';

export class FailedToGetValueException extends InternalServerErrorException {
  private constructor(message: string) {
    super(message, 'FailedToGetValueException');
  }

  static fromError(error: Error) {
    const errorMessage = `Failed to "get" redis value: ${error.message}`;
    return new this(errorMessage);
  }
}
