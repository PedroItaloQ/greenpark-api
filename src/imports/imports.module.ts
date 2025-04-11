import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportsService } from './imports.service';
import { ImportsController } from './imports.controller';
import { Import } from './entitie/import.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Import])],
  controllers: [ImportsController],
  providers: [ImportsService],
  exports: [ImportsService],
})
export class ImportsModule {}
