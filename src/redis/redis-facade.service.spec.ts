import { Test, TestingModule } from '@nestjs/testing';
import { RedisFacadeService } from './redis-facade.service';
import { RedisClientWrapperService } from './redis-client-wrapper.service';
import { RedisKey } from './redis-key.enum';
import { TrackRequestDto } from '../track/dto/track-request.dto';
import { CountIsNotANumberException } from './count-is-not-a-number.exception';

jest.mock('./redis-client-wrapper.service');

describe('RedisFacadeService', () => {
  let service: RedisFacadeService;
  let redisClientWrapperServiceMock: RedisClientWrapperService;

  beforeEach(async () => {
    redisClientWrapperServiceMock = {
      increaseBy: jest.fn(),
      get: jest.fn(),
    } as unknown as RedisClientWrapperService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisFacadeService,
        {
          provide: RedisClientWrapperService,
          useValue: redisClientWrapperServiceMock,
        },
      ],
    }).compile();

    service = module.get<RedisFacadeService>(RedisFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('appendCount', () => {
    it('should call increaseBy with correct parameters when count is a number', async () => {
      const trackRequestDto: TrackRequestDto = {
        id: 1,
        count: 42,
        content: 'test content',
      };

      await service.appendCount(trackRequestDto);

      expect(redisClientWrapperServiceMock.increaseBy).toHaveBeenCalledWith(
        RedisKey.COUNT,
        trackRequestDto.count,
      );
    });

    it('should not call increaseBy if count is not a number', async () => {
      const trackRequestDto: TrackRequestDto = {
        id: 1,
        count: 'invalid' as unknown as number,
        content: 'test content',
      };

      await service.appendCount(trackRequestDto);

      expect(redisClientWrapperServiceMock.increaseBy).not.toHaveBeenCalled();
    });
  });

  describe('getCount', () => {
    it('should return the count as a number when Redis returns a valid value', async () => {
      const mockCount = '42';
      (redisClientWrapperServiceMock.get as jest.Mock).mockResolvedValue(
        mockCount,
      );

      const result = await service.getCount();

      expect(result).toBe(42);
      expect(redisClientWrapperServiceMock.get).toHaveBeenCalledWith(
        RedisKey.COUNT,
      );
    });

    it('should throw CountIsNotANumberException when Redis returns an invalid value', async () => {
      const invalidCount = 'invalid';
      (redisClientWrapperServiceMock.get as jest.Mock).mockResolvedValue(
        invalidCount,
      );

      await expect(service.getCount()).rejects.toThrow(
        CountIsNotANumberException.create(),
      );
      expect(redisClientWrapperServiceMock.get).toHaveBeenCalledWith(
        RedisKey.COUNT,
      );
    });

    it('should return 0 if Redis returns an empty or null value', async () => {
      (redisClientWrapperServiceMock.get as jest.Mock).mockResolvedValue(null);

      const result = await service.getCount();

      expect(result).toBe(0);
      expect(redisClientWrapperServiceMock.get).toHaveBeenCalledWith(
        RedisKey.COUNT,
      );
    });
  });
});
