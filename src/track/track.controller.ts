import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { TrackRequestDto } from './dto/track-request.dto';
import { TrackService } from './track.service';
import { ZodValidationPipe } from '../component/pipe/zod-validation.pipe';
import { TrackRequestSchema } from './dto/track-request.schema';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(TrackRequestSchema))
  async trackRequest(@Body() trackRequestDto: TrackRequestDto): Promise<void> {
    await this.trackService.appendContent(trackRequestDto);
    await this.trackService.incrementCount(trackRequestDto);
  }
}
