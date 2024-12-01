import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRequestDto } from './dto/track-request.dto';
import { RedisFacadeService } from '../redis/redis-facade.service';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';

describe('TrackController', () => {
  let controller: TrackController;
  let trackServiceMock: Partial<TrackService>;
  let redisFacadeServiceMock: {
    appendCount: jest.Mock<any, any, any>;
    getCount: jest.Mock<any, any, any>;
  };

  beforeEach(async () => {
    trackServiceMock = {
      appendToFile: jest.fn(),
      fileService: {
        append: jest.fn(),
      },
    };

    redisFacadeServiceMock = {
      appendCount: jest.fn(),
      getCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        {
          provide: TrackService,
          useValue: trackServiceMock,
        },
        {
          provide: RedisFacadeService,
          useValue: redisFacadeServiceMock,
        },
        ZodValidationPipe,
      ],
    }).compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call RedisFacadeService.appendCount when trackRequest is called', async () => {
    const trackRequestDto: TrackRequestDto = {
      id: 1,
      count: 42,
      content: 'some testing content',
    };

    await controller.trackRequest(trackRequestDto);

    expect(redisFacadeServiceMock.appendCount).toHaveBeenCalledWith(
      trackRequestDto,
    );
    expect(redisFacadeServiceMock.appendCount).toHaveBeenCalledTimes(1);
  });

  it('should call TrackService.appendToFile when trackRequest is called', async () => {
    const trackRequestDto: TrackRequestDto = {
      id: 1,
      count: 42,
      content: 'some testing content',
    };

    await controller.trackRequest(trackRequestDto);

    expect(trackServiceMock.appendToFile).toHaveBeenCalledWith(trackRequestDto);
    expect(trackServiceMock.appendToFile).toHaveBeenCalledTimes(1);
  });
});
