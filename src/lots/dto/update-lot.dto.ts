import { IsOptional, IsString } from 'class-validator';

export class UpdateLotDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  active?: boolean;
}
