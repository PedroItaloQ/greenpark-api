import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Import } from './entitie/import.entity';
import { CreateImportDto } from './dto/create-import.dto';
import { Invoice } from 'src/invoices/entitie/invoice.entity';
import { Lot } from 'src/lots/entitie/lot.entity';

@Injectable()
export class ImportsService {
  constructor(
    @InjectRepository(Import)
    private importRepo: Repository<Import>,

    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,

    @InjectRepository(Lot)
    private lotRepo: Repository<Lot>,
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

  async processCSV(file: Express.Multer.File) {
    const filePath = path.join(process.cwd(), file.path);
  
    const importacao = this.importRepo.create({ file_name: file.originalname });
    const importSaved = await this.importRepo.save(importacao);
  
    const boletos: Invoice[] = [];
    const tasks: Promise<void>[] = [];
    let order = 1;
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          const task = this.lotRepo.findOneBy({ name: row['unidade']?.toString().trim().padStart(4, '0') })
            .then((loteEncontrado) => {
              if (!loteEncontrado) {
                console.log(`Lote ${row['unidade']} não encontrado`);
                return;
              }
  
              const boleto = this.invoiceRepo.create({
                payer_name: row['nome']?.toString().trim(),
                amount: parseFloat(row['valor']),
                digitable_line: row['linha_digitavel']?.toString().trim(),
                lot: loteEncontrado,
                import: importSaved,
                order: order++,
              });
  
              boletos.push(boleto);
            });
  
          tasks.push(task);
        })
        .on('end', async () => {
          try {
            await Promise.all(tasks);
            await this.invoiceRepo.save(boletos);
            resolve({ mensagem: 'Boletos importados com sucesso', count: boletos.length });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', reject);
    });
  }  
}
