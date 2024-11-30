import { Body, Controller, Post } from '@nestjs/common';
import { TrackRequestDto } from './dto/track-request.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async trackRequest(@Body() trackRequestDto: TrackRequestDto): Promise<void> {
    await this.trackService.appendToFile(trackRequestDto);
  }
}
