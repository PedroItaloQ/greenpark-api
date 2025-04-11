import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entitie/invoice.entity';
import { Lot } from '../lots/entitie/lot.entity';
import { Import } from '../imports/entitie/import.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Lot, Import]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
