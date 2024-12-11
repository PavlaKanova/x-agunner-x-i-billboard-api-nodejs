import { Inject, Injectable } from '@nestjs/common';
import { TrackRequestDto } from './dto/track-request.dto';
import {
  INCREMENT_COUNT_STORAGE,
  IncrementCountStorage,
} from './increment-count-storage.interface';
import {
  REQUEST_CONTENT_STORAGE,
  RequestContentStorage,
} from './request-content-storage.interface';

@Injectable()
export class TrackService {
  constructor(
    @Inject(REQUEST_CONTENT_STORAGE)
    private readonly requestContentStorage: RequestContentStorage,
    @Inject(INCREMENT_COUNT_STORAGE)
    private readonly countStorage: IncrementCountStorage,
  ) {}

  async appendContent(trackRequestDto: TrackRequestDto): Promise<void> {
    const jsonLine = JSON.stringify(trackRequestDto) + '\n';
    await this.requestContentStorage.append(jsonLine);
  }

  // REVIEW Proc se testuje cislo, i kdyz count muze byt pouze cislo | null
  async incrementCount(trackRequestDto: TrackRequestDto): Promise<void> {
    if (typeof trackRequestDto.count === 'number') {
      await this.countStorage.incrementCount(trackRequestDto.count);
    }
  }
}
