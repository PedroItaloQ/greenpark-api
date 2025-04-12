import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';
import { multerConfig } from '../upload/upload.config';

@Controller()
export class CSVImportController {
  constructor(private readonly service: ImportsService) {}

  @Post('/importar-csv')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async importarCSV(@UploadedFile() file: Express.Multer.File) {
    return this.service.processCSV(file);
  }
}
