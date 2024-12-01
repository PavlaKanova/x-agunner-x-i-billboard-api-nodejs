import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { TrackRequestDto } from './dto/track-request.dto';
import { TrackService } from './track.service';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';
import { TrackRequestSchema } from './dto/track-request.schema';
import { RedisFacadeService } from '../redis/redis-facade.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    readonly redisFacadeService: RedisFacadeService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(TrackRequestSchema))
  async trackRequest(@Body() trackRequestDto: TrackRequestDto): Promise<void> {
    await this.redisFacadeService.appendCount(trackRequestDto);
    await this.trackService.appendToFile(trackRequestDto);
  }
}
