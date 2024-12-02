import { Test, TestingModule } from '@nestjs/testing';
import { CountController } from './count.controller';
import { RedisFacadeService } from '../redis/redis-facade.service';

jest.mock('../redis/redis-facade.service');

describe('CountController', () => {
  let controller: CountController;
  let redisFacadeServiceMock: RedisFacadeService;

  beforeEach(async () => {
    redisFacadeServiceMock = {
      getCount: jest.fn(),
    } as unknown as RedisFacadeService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountController],
      providers: [
        {
          provide: RedisFacadeService,
          useValue: redisFacadeServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CountController>(CountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('count', () => {
    it('should return the count from RedisFacadeService when valid', async () => {
      const mockCount = 42;
      (redisFacadeServiceMock.getCount as jest.Mock).mockResolvedValue(
        mockCount,
      );

      const result = await controller.count();

      expect(result).toBe(mockCount);
      expect(redisFacadeServiceMock.getCount).toHaveBeenCalled();
    });
  });
});
