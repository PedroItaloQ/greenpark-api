import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ImportsService } from './imports.service';
import { CreateImportDto } from './dto/create-import.dto';

@Controller('importacoes')
export class ImportsController {
  constructor(private readonly service: ImportsService) {}

  @Post()
  create(@Body() dto: CreateImportDto) {
    return this.service.create(dto);
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
