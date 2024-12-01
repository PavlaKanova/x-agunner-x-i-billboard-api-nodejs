import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientWrapperService } from './redis-client-wrapper.service';
import { RedisConfigService } from './redis-config.service';
import { createClient, RedisClientType } from 'redis';

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

  it('should call connect when onModuleInit is called', async () => {
    await service.onModuleInit();
    expect(clientMock.connect).toHaveBeenCalled();
  });

  it('should call disconnect when onModuleDestroy is called', async () => {
    await service.onModuleDestroy();
    expect(clientMock.disconnect).toHaveBeenCalled();
  });

  it('should call incrBy with the correct arguments when increaseBy is called', async () => {
    const key = 'count';
    const value = 42;
    await service.increaseBy(key, value);
    expect(clientMock.incrBy).toHaveBeenCalledWith(key, value);
  });

  it('should return the value when get is called', async () => {
    const key = 'count';
    const mockReturnValue = '42';
    (clientMock.get as jest.Mock).mockResolvedValue(mockReturnValue);

    const result = await service.get(key);

    expect(result).toBe(mockReturnValue);
    expect(clientMock.get).toHaveBeenCalledWith(key);
  });

  it('should return null if the key does not exist', async () => {
    const key = 'nonexistent_key';
    (clientMock.get as jest.Mock).mockResolvedValue(null);

    const result = await service.get(key);

    expect(result).toBeNull();
    expect(clientMock.get).toHaveBeenCalledWith(key);
  });
});
