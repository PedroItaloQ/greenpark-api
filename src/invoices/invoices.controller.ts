import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';

@Controller('boletos')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.service.create(dto);
  }

  @Get()
  async find(@Query() filter: FilterInvoiceDto) {
    if (filter.relatorio === '1') {
      const base64 = await this.service.gerarRelatorioPDF(filter);
      return { base64 };
    }

    return this.service.findAll(filter);
  }
}