import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LotsModule } from './lots/lots.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ImportsModule } from './imports/imports.module';
import { Lot } from './lots/entitie/lot.entity';
import { Invoice } from './invoices/entitie/invoice.entity';
import { Import } from './imports/entitie/import.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT') || 5432),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [Lot, Invoice, Import],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LotsModule,
    InvoicesModule,
    ImportsModule,
  ],
})
export class AppModule {}
