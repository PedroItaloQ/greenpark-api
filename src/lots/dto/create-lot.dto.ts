import { IsString, IsOptional } from 'class-validator';

export class CreateLotDto {
  @IsString()
  name: string;

  @IsOptional()
  active?: boolean;
}