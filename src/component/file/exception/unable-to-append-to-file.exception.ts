import { InternalServerErrorException } from '@nestjs/common';

export class UnableToAppendToFileException extends InternalServerErrorException {
  private constructor(message: string) {
    super(message, 'UnableToAppendToFileException');
  }

  static fromException(error: Error, filePath: string) {
    const errorMessage = `Unable to append to file at ${filePath}: ${error.message}`;
    return new this(errorMessage);
  }
}
