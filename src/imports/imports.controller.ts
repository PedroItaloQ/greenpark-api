import { Controller, Post, Body, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportsService } from './imports.service';
import { CreateImportDto } from './dto/create-import.dto';
import { multerConfig } from 'src/upload/upload.config';

@Controller('importacoes')
export class ImportsController {
  constructor(private readonly service: ImportsService) {}

  @Post()
  create(@Body() dto: CreateImportDto) {
    return this.service.create(dto);
  }

  @Post('/importar-csv')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async importarCSV(@UploadedFile() file: Express.Multer.File) {
    return this.service.processCSV(file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
