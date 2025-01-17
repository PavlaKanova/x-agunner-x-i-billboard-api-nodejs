import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      // REVIEW: naformatovat message a ne neexistujici errorMessage
      throw new BadRequestException(`Validation failed: ${error.errorMessage}`);
    }
  }
}
