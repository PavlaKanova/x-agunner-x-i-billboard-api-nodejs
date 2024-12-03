import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { TrackRequestDto } from './dto/track-request.dto';
import {
  REQUEST_CONTENT_STORAGE,
  RequestContentStorage,
} from './request-content-storage.interface';
import {
  INCREMENT_COUNT_STORAGE,
  IncrementCountStorage,
} from './increment-count-storage.interface';

describe('TrackService', () => {
  let service: TrackService;
  let requestContentStorageMock: jest.Mocked<RequestContentStorage>;
  let countStorageMock: jest.Mocked<IncrementCountStorage>;

  beforeEach(async () => {
    requestContentStorageMock = {
      append: jest.fn(),
    };

    countStorageMock = {
      incrementCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: REQUEST_CONTENT_STORAGE,
          useValue: requestContentStorageMock,
        },
        {
          provide: INCREMENT_COUNT_STORAGE,
          useValue: countStorageMock,
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('appendContent', () => {
    it('should call appendContent method on RequestContentStorage with the correct data', async () => {
      const trackRequestDto: TrackRequestDto = {
        id: 1,
        count: 42,
        content: 'some testing content',
      };

      const expectedJsonLine = JSON.stringify(trackRequestDto) + '\n';

      await service.appendContent(trackRequestDto);

      expect(requestContentStorageMock.append).toHaveBeenCalledTimes(1);
      expect(requestContentStorageMock.append).toHaveBeenCalledWith(
        expectedJsonLine,
      );
    });
  });

  describe('incrementCount', () => {
    it('should call countStorage.incrementCount with the correct count when count is a number', async () => {
      const trackRequestDto: TrackRequestDto = {
        id: 1,
        count: 42,
        content: 'test content',
      };

      await service.incrementCount(trackRequestDto);

      expect(countStorageMock.incrementCount).toHaveBeenCalledWith(42);
      expect(countStorageMock.incrementCount).toHaveBeenCalledTimes(1);
    });

    it('should not call countStorage.incrementCount if count is not a number', async () => {
      const trackRequestDto: TrackRequestDto = {
        id: 1,
        count: 'invalid' as unknown as number,
        content: 'test content',
      };

      await service.incrementCount(trackRequestDto);

      expect(countStorageMock.incrementCount).not.toHaveBeenCalled();
    });
  });
});
