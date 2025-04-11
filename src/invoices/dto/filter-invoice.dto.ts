import { IsOptional, IsString, IsUUID, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterInvoiceDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @Type(() => Number)
  valor_inicial?: number;

  @IsOptional()
  @Type(() => Number)
  valor_final?: number;

  @IsOptional()
  @IsUUID()
  id_lote?: string;

  @IsOptional()
  relatorio?: string;
}
