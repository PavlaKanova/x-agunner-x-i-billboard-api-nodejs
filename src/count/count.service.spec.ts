import { Test, TestingModule } from '@nestjs/testing';
import { CountService } from './count.service';
import {
  GET_COUNT_STORAGE,
  GetCountStorage,
} from '../track/get-count-storage.interface';

describe('CountService', () => {
  let service: CountService;
  let countStorageMock: jest.Mocked<GetCountStorage>;

  beforeEach(async () => {
    countStorageMock = {
      getCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountService,
        {
          provide: GET_COUNT_STORAGE,
          useValue: countStorageMock,
        },
      ],
    }).compile();

    service = module.get<CountService>(CountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCount', () => {
    it('should return the count from the countStorage', async () => {
      const mockCount = 42;
      countStorageMock.getCount.mockResolvedValue(mockCount);

      const result = await service.getCount();

      expect(result).toBe(mockCount);
      expect(countStorageMock.getCount).toHaveBeenCalledTimes(1);
    });

    it('should propagate an error from the countStorage', async () => {
      const error = new Error('Failed to get count');
      countStorageMock.getCount.mockRejectedValue(error);

      await expect(service.getCount()).rejects.toThrow(error);
      expect(countStorageMock.getCount).toHaveBeenCalledTimes(1);
    });
  });
});
