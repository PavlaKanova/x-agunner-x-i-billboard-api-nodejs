import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { DirectoryLocationModule } from '../directory-location/directory-location.module';

@Module({
  providers: [FileService],
  exports: [FileService, DirectoryLocationModule],
  imports: [DirectoryLocationModule],
})
export class FileModule {}
