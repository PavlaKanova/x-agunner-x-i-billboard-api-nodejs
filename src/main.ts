import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './component/logger/winston-logger.service';
import { CustomExceptionFilter } from './component/filter/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WinstonLoggerService).createLogger();
  app.useLogger(logger);

  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
