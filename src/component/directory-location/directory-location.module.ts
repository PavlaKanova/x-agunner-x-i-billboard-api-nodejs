import { Module } from '@nestjs/common';
import { DirectoryLocationService } from './directory-location.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DirectoryLocationService],
  imports: [ConfigModule],
  exports: [DirectoryLocationService],
})
export class DirectoryLocationModule {}
