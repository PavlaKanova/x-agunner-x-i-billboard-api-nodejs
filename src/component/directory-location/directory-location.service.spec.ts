import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DirectoryLocationService } from './directory-location.service';
import * as path from 'node:path';

describe('DirectoryLocationService', () => {
  let service: DirectoryLocationService;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    configServiceMock = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DirectoryLocationService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<DirectoryLocationService>(DirectoryLocationService);
  });

  describe('getRootDirPath', () => {
    it('should return resolved root directory path when ABSOLUTE_DIR_PATH_ROOT is defined', () => {
      const mockRootPath = '/mock/root';
      configServiceMock.get.mockReturnValueOnce(mockRootPath);

      const result = service['getRootDirPath']();

      expect(result).toBe(path.resolve(mockRootPath));
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'ABSOLUTE_DIR_PATH_ROOT',
        { infer: true },
      );
    });

    it('should throw an error when ABSOLUTE_DIR_PATH_ROOT is not defined', () => {
      configServiceMock.get.mockReturnValueOnce(undefined);

      expect(() => service['getRootDirPath']()).toThrow(Error);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'ABSOLUTE_DIR_PATH_ROOT',
        { infer: true },
      );
    });
  });

  describe('getStorageDirPath', () => {
    it('should return resolved storage directory path when both DIR_PATH_STORAGE and ABSOLUTE_DIR_PATH_ROOT are defined', () => {
      const mockRootPath = '/mock/root';
      const mockStoragePath = 'storage/path';
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'ABSOLUTE_DIR_PATH_ROOT') return mockRootPath;
        if (key === 'DIR_PATH_STORAGE') return mockStoragePath;
        return undefined;
      });

      const result = service.getStorageDirPath();

      expect(result).toBe(path.resolve(mockRootPath, mockStoragePath));
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'ABSOLUTE_DIR_PATH_ROOT',
        { infer: true },
      );
      expect(configServiceMock.get).toHaveBeenCalledWith('DIR_PATH_STORAGE', {
        infer: true,
      });
    });

    it('should throw an error when DIR_PATH_STORAGE is not defined', () => {
      const mockRootPath = '/mock/root';
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'ABSOLUTE_DIR_PATH_ROOT') return mockRootPath;
        return undefined;
      });

      expect(() => service.getStorageDirPath()).toThrow(Error);
      expect(configServiceMock.get).toHaveBeenCalledWith('DIR_PATH_STORAGE', {
        infer: true,
      });
    });

    it('should throw an error when ABSOLUTE_DIR_PATH_ROOT is not defined', () => {
      const mockStoragePath = 'storage/path';
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'DIR_PATH_STORAGE') return mockStoragePath;
        return undefined;
      });

      expect(() => service.getStorageDirPath()).toThrow(Error);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'ABSOLUTE_DIR_PATH_ROOT',
        { infer: true },
      );
    });
  });

  describe('getLogDirPath', () => {
    it('should return resolved logs directory path when both DIR_PATH_LOGS and ABSOLUTE_DIR_PATH_ROOT are defined', () => {
      const mockRootPath = '/mock/root';
      const mockLogsPath = 'logs/path';
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'ABSOLUTE_DIR_PATH_ROOT') return mockRootPath;
        if (key === 'DIR_PATH_LOGS') return mockLogsPath;
        return undefined;
      });

      const result = service.getLogDirPath();

      expect(result).toBe(path.resolve(mockRootPath, mockLogsPath));
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'ABSOLUTE_DIR_PATH_ROOT',
        { infer: true },
      );
      expect(configServiceMock.get).toHaveBeenCalledWith('DIR_PATH_LOGS', {
        infer: true,
      });
    });

    it('should throw an error when DIR_PATH_LOGS is not defined', () => {
      const mockRootPath = '/mock/root';
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'ABSOLUTE_DIR_PATH_ROOT') return mockRootPath;
        return undefined;
      });

      expect(() => service.getLogDirPath()).toThrow(Error);
      expect(configServiceMock.get).toHaveBeenCalledWith('DIR_PATH_LOGS', {
        infer: true,
      });
    });

    it('should throw an error when ABSOLUTE_DIR_PATH_ROOT is not defined', () => {
      const mockLogsPath = 'logs/path';
      configServiceMock.get.mockImplementation((key) => {
        if (key === 'DIR_PATH_LOGS') return mockLogsPath;
        return undefined;
      });

      expect(() => service.getLogDirPath()).toThrow(Error);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'ABSOLUTE_DIR_PATH_ROOT',
        { infer: true },
      );
    });
  });
});
