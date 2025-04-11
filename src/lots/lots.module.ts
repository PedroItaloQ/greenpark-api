import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';

@Module({
  providers: [LotsService]
})
export class LotsModule {}
