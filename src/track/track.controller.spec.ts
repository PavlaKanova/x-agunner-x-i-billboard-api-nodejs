import { Test, TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRequestDto } from './dto/track-request.dto';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';

describe('TrackController', () => {
  let controller: TrackController;
  let trackServiceMock: Partial<TrackService>;

  beforeEach(async () => {
    trackServiceMock = {
      appendContent: jest.fn(),
      incrementCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackController],
      providers: [
        {
          provide: TrackService,
          useValue: trackServiceMock,
        },
        ZodValidationPipe,
      ],
    }).compile();

    controller = module.get<TrackController>(TrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trackRequest', () => {
    it('should call TrackService.appendToFile and incrementCount with the correct DTO', async () => {
      const trackRequestDto: TrackRequestDto = {
        id: 1,
        count: 42,
        content: 'test content',
      };

      await controller.trackRequest(trackRequestDto);

      expect(trackServiceMock.appendContent).toHaveBeenCalledWith(
        trackRequestDto,
      );
      expect(trackServiceMock.appendContent).toHaveBeenCalledTimes(1);

      expect(trackServiceMock.incrementCount).toHaveBeenCalledWith(
        trackRequestDto,
      );
      expect(trackServiceMock.incrementCount).toHaveBeenCalledTimes(1);
    });
  });
});
