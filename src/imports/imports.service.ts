import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Import } from './entitie/import.entity';
import { CreateImportDto } from './dto/create-import.dto';

@Injectable()
export class ImportsService {
  constructor(
    @InjectRepository(Import)
    private importRepo: Repository<Import>,
  ) {}

  async create(dto: CreateImportDto): Promise<Import> {
    const imp = this.importRepo.create(dto);
    return this.importRepo.save(imp);
  }

  async findAll(): Promise<Import[]> {
    return this.importRepo.find();
  }

  async findOne(id: string): Promise<Import> {
    const imp = await this.importRepo.findOneBy({ id });
    if (!imp) {
      throw new NotFoundException(`Importação com ID ${id} não encontrada`);
    }
    return imp;
  }
}
