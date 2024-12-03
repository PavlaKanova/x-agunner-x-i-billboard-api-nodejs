import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { appendFile, mkdir } from 'fs/promises';
import { DirectoryNotExistException } from './exception/directory-not-exist.exception';
import { UnableToAppendToFileException } from './exception/unable-to-append-to-file.exception';
import { DirectoryLocationService } from '../directory-location/directory-location.service';
import * as path from 'node:path';

jest.mock('fs/promises');

describe('FileService', () => {
  let service: FileService;
  let directoryLocationServiceMock: Partial<DirectoryLocationService>;

  const mkdirMock = mkdir as jest.Mock;
  const appendFileMock = appendFile as jest.Mock;

  beforeEach(async () => {
    directoryLocationServiceMock = {
      getStorageDirPath: jest.fn().mockReturnValue('/path/to'),
    } as unknown as DirectoryLocationService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: DirectoryLocationService,
          useValue: directoryLocationServiceMock,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('append', () => {
    const content = 'Sample content';

    it('should create directory and append content to file', async () => {
      const filePath = path.resolve('/path/to', 'track-request.log'); // Ensure the file path is resolved correctly
      mkdirMock.mockResolvedValueOnce(undefined);
      appendFileMock.mockResolvedValueOnce(undefined);

      await expect(service.append(content)).resolves.toBeUndefined();

      expect(directoryLocationServiceMock.getStorageDirPath).toHaveBeenCalled();
      expect(mkdirMock).toHaveBeenCalledWith('/path/to', { recursive: true });
      expect(appendFileMock).toHaveBeenCalledWith(filePath, content, 'utf8');
    });

    it('should throw DirectoryNotExistException if mkdir fails', async () => {
      const mkdirError = new Error('mkdir failed');
      mkdirMock.mockRejectedValueOnce(mkdirError);

      await expect(service.append(content)).rejects.toThrow(
        DirectoryNotExistException.fromException(mkdirError, '/path/to'),
      );

      expect(appendFileMock).not.toHaveBeenCalled();
      expect(mkdirMock).toHaveBeenCalledWith('/path/to', { recursive: true });
    });

    it('should throw UnableToAppendToFileException if appendFile fails', async () => {
      const filePath = path.resolve('/path/to', 'track-request.log');
      mkdirMock.mockResolvedValueOnce(undefined);
      const appendError = new Error('appendFile failed');
      appendFileMock.mockRejectedValueOnce(appendError);

      await expect(service.append(content)).rejects.toThrow(
        UnableToAppendToFileException.fromException(appendError, filePath),
      );

      expect(mkdirMock).toHaveBeenCalledWith('/path/to', { recursive: true });
      expect(appendFileMock).toHaveBeenCalledWith(filePath, content, 'utf8');
    });
  });
});
