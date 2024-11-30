import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRequestDto } from './dto/track-request.dto';

describe('TrackController', () => {
  let controller: TrackController;
  let trackServiceMock: jest.Mocked<TrackService>;

  beforeEach(async () => {
    trackServiceMock = {
      appendToFile: jest.fn(),
      fileService: {
        append: jest.fn(),
      },
      filePath: '/mock/path',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        {
          provide: TrackService,
          useValue: trackServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
