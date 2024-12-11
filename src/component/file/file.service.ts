import { Injectable } from '@nestjs/common';
import { appendFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { DirectoryNotExistException } from './exception/directory-not-exist.exception';
import { UnableToAppendToFileException } from './exception/unable-to-append-to-file.exception';
import { RequestContentStorage } from '../../track/request-content-storage.interface';
import { DirectoryLocationService } from '../directory-location/directory-location.service';

// REVIEW FileService je takový nic neříkající název. Představoval bych si něco, co bude říkat že se pro request storage využívá file system
@Injectable()
export class FileService implements RequestContentStorage {
  constructor(readonly directoryLocationService: DirectoryLocationService) {}

  async append(content: string): Promise<void> {
    const filePath = path.resolve(
      this.directoryLocationService.getStorageDirPath(),
      'track-request.log',
    );
    const dirPath = path.dirname(filePath);

    try {
      await mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw DirectoryNotExistException.fromException(error, dirPath);
    }

    try {
      await appendFile(filePath, content, 'utf8');
    } catch (error) {
      throw UnableToAppendToFileException.fromException(error, filePath);
    }
  }
}
