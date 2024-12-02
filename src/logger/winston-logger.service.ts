import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { DirectoryLocationService } from '../directory-location/directory-location.service';

@Injectable()
export class WinstonLoggerService {
  constructor(
    private readonly directoryLocationService: DirectoryLocationService,
  ) {}

  createLogger() {
    const logDirectory = this.directoryLocationService.getLogDirPath();

    return WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: path.resolve(logDirectory, 'error.log'),
          level: 'warn',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              ({ timestamp, level, message, stack, ...meta }) => {
                let log = `[${timestamp}]\t[${level.toUpperCase()}]\t${message}`;

                if (stack)
                  log += `\tStack: ${stack.toString().replace(/\n/g, '\t')}`;

                if (Object.keys(meta).length)
                  log += `\tMetadata: ${JSON.stringify(meta)}`;
                return log;
              },
            ),
          ),
        }),
      ],
    });
  }
}
