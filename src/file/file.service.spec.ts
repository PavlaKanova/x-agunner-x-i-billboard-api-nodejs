import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { appendFile, mkdir } from 'fs/promises';
import { DirectoryNotExistException } from './directory-not-exist.exception';
import { UnableToAppendToFileException } from './unable-to-append-to-file.exception';

jest.mock('fs/promises');

describe('FileService', () => {
  let service: FileService;

  const mkdirMock = mkdir as jest.Mock;
  const appendFileMock = appendFile as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('append', () => {
    const filePath = '/path/to/file.txt';
    const content = 'Sample content';

    it('should create directory and append content to file', async () => {
      mkdirMock.mockResolvedValueOnce(undefined);
      appendFileMock.mockResolvedValueOnce(undefined);

      await expect(service.append(filePath, content)).resolves.toBeUndefined();

      expect(mkdirMock).toHaveBeenCalledWith('/path/to', { recursive: true });
      expect(appendFileMock).toHaveBeenCalledWith(filePath, content, 'utf8');
    });

    it('should throw DirectoryNotExistException if mkdir fails', async () => {
      const mkdirError = new Error('mkdir failed');
      mkdirMock.mockRejectedValueOnce(mkdirError);

      await expect(service.append(filePath, content)).rejects.toThrow(
        DirectoryNotExistException.fromException(mkdirError, '/path/to'),
      );

      expect(appendFileMock).not.toHaveBeenCalled();
      expect(mkdirMock).toHaveBeenCalledWith('/path/to', { recursive: true });

      try {
        await service.append(filePath, content);
      } catch (error) {
        expect(error).toBeInstanceOf(DirectoryNotExistException);
        expect(error.cause).toBe(mkdirError);
        expect(error.message).toBe(`Failed to create directory: /path/to`);
      }
    });

    it('should throw UnableToAppendToFileException if appendFile fails', async () => {
      mkdirMock.mockResolvedValueOnce(undefined);
      const appendError = new Error('appendFile failed');
      appendFileMock.mockRejectedValueOnce(appendError);

      await expect(service.append(filePath, content)).rejects.toThrow(
        UnableToAppendToFileException.fromException(appendError, '/path/to'),
      );

      expect(mkdirMock).toHaveBeenCalledWith('/path/to', { recursive: true });
      expect(appendFileMock).toHaveBeenCalledWith(filePath, content, 'utf8');

      try {
        await service.append(filePath, content);
      } catch (error) {
        expect(error).toBeInstanceOf(UnableToAppendToFileException);
        expect(error.cause).toBe(appendError);
      }
    });
  });
});
