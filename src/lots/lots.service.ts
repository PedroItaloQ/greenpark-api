import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lot } from './entitie/lot.entity';
import { Repository } from 'typeorm';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotRepo: Repository<Lot>,
  ) {}

  async create(dto: CreateLotDto): Promise<Lot> {
    const lot = this.lotRepo.create(dto);
    return this.lotRepo.save(lot);
  }

  async findAll(): Promise<Lot[]> {
    return this.lotRepo.find();
  }

  async findOne(id: string): Promise<Lot> {
    const lot = await this.lotRepo.findOneBy({ id });
    if (!lot) throw new NotFoundException('Lote não encontrado');
    return lot;
  }

  async update(id: string, dto: UpdateLotDto): Promise<Lot> {
    const lot = await this.findOne(id);
    Object.assign(lot, dto);
    return this.lotRepo.save(lot);
  }

  async remove(id: string): Promise<void> {
    const lot = await this.findOne(id);
    await this.lotRepo.remove(lot);
  }
}
