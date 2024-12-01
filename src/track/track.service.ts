import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { FileService } from '../file/file.service';
import { TrackRequestDto } from './dto/track-request.dto';
import { DirectoryLocationService } from '../directory-location/directory-location.service';

@Injectable()
export class TrackService {
  constructor(
    readonly fileService: FileService,
    readonly directoryLocation: DirectoryLocationService,
  ) {}

  /**
   * Saves the data as a single-line JSON to the log file.
   * @param trackRequestDto - Data to be saved.
   */
  async appendToFile(trackRequestDto: TrackRequestDto): Promise<void> {
    const jsonLine = JSON.stringify(trackRequestDto) + '\n';
    await this.fileService.append(
      path.resolve(
        this.directoryLocation.getStorageDirPath(),
        'track-request.log',
      ),
      jsonLine,
    );
  }
}
