import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesService } from './invoices/invoices.service';
import { InvoicesModule } from './invoices/invoices.module';
import { LotsController } from './lots/lots.controller';
import { LotsModule } from './lots/lots.module';
import { ImportsController } from './imports/imports.controller';
import { ImportsModule } from './imports/imports.module';

@Module({
  imports: [InvoicesModule, LotsModule, ImportsModule],
  controllers: [AppController, InvoicesController, LotsController, ImportsController],
  providers: [AppService, InvoicesService],
})
export class AppModule {}
