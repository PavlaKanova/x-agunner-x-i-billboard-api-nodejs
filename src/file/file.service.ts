import { Injectable } from '@nestjs/common';
import { appendFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { DirectoryNotExistException } from './exception/directory-not-exist.exception';
import { UnableToAppendToFileException } from './exception/unable-to-append-to-file.exception';

@Injectable()
export class FileService {
  async append(filePath: string, content: string): Promise<void> {
    const dirPath = path.dirname(filePath);

    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw DirectoryNotExistException.fromException(error, dirPath);
    }

    try {
      await appendFile(filePath, content, 'utf8');
    } catch (error) {
      throw UnableToAppendToFileException.fromException(error, dirPath);
    }
  }
}
