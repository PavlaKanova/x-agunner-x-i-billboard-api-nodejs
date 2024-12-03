import { Inject, Injectable } from '@nestjs/common';
import {
  GET_COUNT_STORAGE,
  GetCountStorage,
} from '../track/get-count-storage.interface';

@Injectable()
export class CountService {
  constructor(
    @Inject(GET_COUNT_STORAGE)
    readonly countStorage: GetCountStorage,
  ) {}

  async getCount(): Promise<number> {
    return await this.countStorage.getCount();
  }
}
