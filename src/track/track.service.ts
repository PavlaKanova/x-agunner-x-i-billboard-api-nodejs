import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { FileService } from '../file/file.service';
import { TrackRequestDto } from './dto/track-request.dto';

@Injectable()
export class TrackService {
  readonly filePath = path.resolve(
    __dirname,
    '..',
    '..',
    'storage',
    'track-requests.log',
  );

  constructor(readonly fileService: FileService) {}

  /**
   * Saves the data as a single-line JSON to the log file.
   * @param trackRequestDto - Data to be saved.
   */
  async appendToFile(trackRequestDto: TrackRequestDto): Promise<void> {
    const jsonLine = JSON.stringify(trackRequestDto) + '\n';
    await this.fileService.append(this.filePath, jsonLine);
  }
}
