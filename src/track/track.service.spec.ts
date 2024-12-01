import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { FileService } from '../file/file.service';
import { TrackRequestDto } from './dto/track-request.dto';
import { DirectoryLocationService } from '../directory-location/directory-location.service';

describe('TrackService', () => {
  let service: TrackService;
  let fileServiceMock: jest.Mocked<FileService>;
  let directoryLocationMock: Partial<DirectoryLocationService>;

  beforeEach(async () => {
    fileServiceMock = {
      append: jest.fn(),
    };

    directoryLocationMock = {
      getStorageDirPath: jest.fn().mockReturnValue('/mock/storage/path'),
      getRootDirPath: jest.fn(), // Not used in this test
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
        {
          provide: DirectoryLocationService,
          useValue: directoryLocationMock,
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call append method of FileService with the correct path and data', async () => {
    const trackRequestDto: TrackRequestDto = {
      id: 1,
      count: 42,
      content: 'some testing content',
    };

    const jsonLine = JSON.stringify(trackRequestDto) + '\n';
    const expectedFilePath = '/mock/storage/path/track-request.log';

    await service.appendToFile(trackRequestDto);

    expect(directoryLocationMock.getStorageDirPath).toHaveBeenCalledTimes(1);
    expect(fileServiceMock.append).toHaveBeenCalledWith(
      expectedFilePath,
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
    expect(directoryLocationMock.getStorageDirPath).toHaveBeenCalledTimes(1);
  });
});
