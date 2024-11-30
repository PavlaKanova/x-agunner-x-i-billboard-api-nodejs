import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { FileService } from '../file/file.service';
import { TrackRequestDto } from './dto/track-request.dto';

describe('TrackService', () => {
  let service: TrackService;
  let fileServiceMock: jest.Mocked<FileService>;

  beforeEach(async () => {
    fileServiceMock = {
      append: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call append method of FileService when appendToFile is called', async () => {
    const trackRequestDto: TrackRequestDto = {
      id: 1,
      count: 42,
      content: 'some testing content',
    };

    const jsonLine = JSON.stringify(trackRequestDto) + '\n';

    await service.appendToFile(trackRequestDto);

    expect(fileServiceMock.append).toHaveBeenCalledWith(
      expect.any(String),
      jsonLine,
    );
  });

  it('should throw an error if FileService.append fails', async () => {
    const trackRequestDto: TrackRequestDto = {
      id: 1,
      count: 42,
      content: 'some testing content',
    };

    const error = new Error('File append failed');
    fileServiceMock.append.mockRejectedValueOnce(error);

    await expect(service.appendToFile(trackRequestDto)).rejects.toThrow(error);
  });
});
