import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportsService } from './imports.service';
import { ImportsController } from './imports.controller';
import { Import } from './entitie/import.entity';
import { Invoice } from 'src/invoices/entitie/invoice.entity';
import { Lot } from 'src/lots/entitie/lot.entity';
import { CSVImportController } from '../imports/csv-import.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Import, Invoice, Lot])
  ],
  controllers: [ImportsController, CSVImportController],
  providers: [ImportsService],
  exports: [ImportsService],
})
export class ImportsModule {}
