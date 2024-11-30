import { InternalServerErrorException } from '@nestjs/common';

export class DirectoryNotExistException extends InternalServerErrorException {
  private constructor(message: string) {
    super(message, 'DirectoryNotExistException');
  }

  static fromException(error: Error, filePath: string) {
    const errorMessage = `File path ${filePath} does not exist: ${error.message}`;
    return new this(errorMessage);
  }
}
