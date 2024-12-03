import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Catch(InternalServerErrorException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    this.logger.error(`Exception occurred at ${request.url}`, exception.stack);

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
