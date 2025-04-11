import { IsNotEmpty, IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  payer_name: string;

  @IsUUID()
  lot_id: string;

  @IsNumber()
  amount: number;

  @IsString()
  digitable_line: string;

  @IsUUID()
  import_id: string;

  order?: number;
}
