import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientWrapperService } from '../redis-client-wrapper.service';
import { RedisConfigService } from '../redis-config.service';
import { createClient, RedisClientType } from 'redis';
import { RedisKey } from '../redis-key.enum';
import { FailedToIncreaseByException } from './failed-to-increase-by.exception';
import { FailedToGetValueException } from './failed-to-get-value.exception';
import { CountIsNotANumberException } from './count-is-not-a-number.exception';
// REVIEW spatne slozka?
jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

describe('RedisClientWrapperService', () => {
  let service: RedisClientWrapperService;
  let redisConfigServiceMock: RedisConfigService;
  let clientMock: RedisClientType;

  beforeEach(async () => {
    redisConfigServiceMock = {
      url: 'redis://localhost:6379',
    } as unknown as RedisConfigService;

    clientMock = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      incrBy: jest.fn(),
      get: jest.fn(),
    } as unknown as RedisClientType;

    (createClient as jest.Mock).mockReturnValue(clientMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisClientWrapperService,
        { provide: RedisConfigService, useValue: redisConfigServiceMock },
      ],
    }).compile();

    service = module.get<RedisClientWrapperService>(RedisClientWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call client.connect', async () => {
      await service.onModuleInit();
      expect(clientMock.connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call client.disconnect', async () => {
      await service.onModuleDestroy();
      expect(clientMock.disconnect).toHaveBeenCalled();
    });
  });

  describe('incrementCount', () => {
    it('should call incrBy with the correct arguments', async () => {
      const value = 42;
      await service.incrementCount(value);
      expect(clientMock.incrBy).toHaveBeenCalledWith(RedisKey.COUNT, value);
    });

    it('should throw FailedToIncreaseByException on failure', async () => {
      const value = 42;
      const error = new Error('Redis incrBy error');
      (clientMock.incrBy as jest.Mock).mockRejectedValue(error);

      await expect(service.incrementCount(value)).rejects.toThrow(
        FailedToIncreaseByException.fromError(error),
      );
    });
  });

  describe('getCount', () => {
    it('should return the parsed count value', async () => {
      const mockValue = '42';
      (clientMock.get as jest.Mock).mockResolvedValue(mockValue);

      const result = await service.getCount();

      expect(result).toBe(42);
      expect(clientMock.get).toHaveBeenCalledWith(RedisKey.COUNT);
    });

    it('should return 0 if the key does not exist', async () => {
      (clientMock.get as jest.Mock).mockResolvedValue(null);

      const result = await service.getCount();

      expect(result).toBe(0);
      expect(clientMock.get).toHaveBeenCalledWith(RedisKey.COUNT);
    });

    it('should throw CountIsNotANumberException if the value is not a number', async () => {
      const mockValue = 'not-a-number';
      (clientMock.get as jest.Mock).mockResolvedValue(mockValue);

      await expect(service.getCount()).rejects.toThrow(
        CountIsNotANumberException.create(),
      );
    });

    it('should throw FailedToGetValueException on client.get failure', async () => {
      const error = new Error('Redis get error');
      (clientMock.get as jest.Mock).mockRejectedValue(error);

      await expect(service.getCount()).rejects.toThrow(
        FailedToGetValueException.fromError(error),
      );
    });
  });
});
