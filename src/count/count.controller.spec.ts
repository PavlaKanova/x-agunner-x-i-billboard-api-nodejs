import { Test, TestingModule } from '@nestjs/testing';
import { CountController } from './count.controller';
import { CountService } from './count.service';

describe('CountController', () => {
  let controller: CountController;
  let countServiceMock: Partial<CountService>;

  beforeEach(async () => {
    countServiceMock = {
      getCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountController],
      providers: [
        {
          provide: CountService,
          useValue: countServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CountController>(CountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('count', () => {
    it('should return the count from CountService', async () => {
      const mockCount = 42;
      (countServiceMock.getCount as jest.Mock).mockResolvedValue(mockCount);

      const result = await controller.count();

      expect(result).toBe(mockCount);
      expect(countServiceMock.getCount).toHaveBeenCalled();
    });
  });
});
