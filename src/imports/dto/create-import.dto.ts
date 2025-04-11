import { IsString } from 'class-validator';

export class CreateImportDto {
  @IsString()
  file_name: string;
}