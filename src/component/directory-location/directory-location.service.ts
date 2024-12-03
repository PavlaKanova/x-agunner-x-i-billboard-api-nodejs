import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';

@Injectable()
export class DirectoryLocationService {
  constructor(readonly configService: ConfigService) {}

  getRootDirPath(): string {
    const rootDirPath = this.configService.get<string>(
      'ABSOLUTE_DIR_PATH_ROOT',
      {
        infer: true,
      },
    );

    // {infer: true} option should deal with validating string,
    // but for typescript's sake, this needs to stay here
    if (typeof rootDirPath !== 'string') {
      throw new Error();
    }

    return path.resolve(rootDirPath);
  }

  getStorageDirPath(): string {
    const storageDirPath = this.configService.get<string>('DIR_PATH_STORAGE', {
      infer: true,
    });

    // {infer: true} option should deal with validating string,
    // but for typescript's sake, this needs to stay here
    if (typeof storageDirPath !== 'string') {
      throw new Error();
    }

    return path.resolve(this.getRootDirPath(), storageDirPath);
  }

  getLogDirPath(): string {
    const logsDirPath = this.configService.get<string>('DIR_PATH_LOGS', {
      infer: true,
    });

    // {infer: true} option should deal with validating string,
    // but for typescript's sake, this needs to stay here
    if (typeof logsDirPath !== 'string') {
      throw new Error();
    }

    return path.resolve(this.getRootDirPath(), logsDirPath);
  }
}
