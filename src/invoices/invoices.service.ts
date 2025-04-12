import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entitie/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';
import { Lot } from '../lots/entitie/lot.entity';
import { Import } from '../imports/entitie/import.entity';
import { PassThrough } from 'stream';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,

    @InjectRepository(Lot)
    private lotRepo: Repository<Lot>,

    @InjectRepository(Import)
    private importRepo: Repository<Import>,
  ) { }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const lot = await this.lotRepo.findOneBy({ id: dto.lot_id });
    if (!lot) throw new NotFoundException('Lote não encontrado');

    const imp = await this.importRepo.findOneBy({ id: dto.import_id });
    if (!imp) throw new NotFoundException('Importação não encontrada');

    const invoice = this.invoiceRepo.create({
      payer_name: dto.payer_name,
      amount: dto.amount,
      digitable_line: dto.digitable_line,
      order: dto.order || 0,
      lot,
      import: imp,
    });

    return this.invoiceRepo.save(invoice);
  }

  async findAll(filter: FilterInvoiceDto): Promise<Invoice[]> {
    const query = this.invoiceRepo.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.lot', 'lot')
      .leftJoinAndSelect('invoice.import', 'import');

    if (filter.nome) {
      query.andWhere('invoice.payer_name ILIKE :nome', { nome: `%${filter.nome}%` });
    }

    if (filter.valor_inicial) {
      query.andWhere('invoice.amount >= :min', { min: filter.valor_inicial });
    }

    if (filter.valor_final) {
      query.andWhere('invoice.amount <= :max', { max: filter.valor_final });
    }

    if (filter.id_lote) {
      query.andWhere('lot.id = :id_lote', { id_lote: filter.id_lote });
    }

    return query.getMany();
  }

  async gerarRelatorioPDF(filter: FilterInvoiceDto): Promise<string> {
    const boletos = await this.findAll(filter);

    const PDFKit = require('pdfkit');
    const { default: getStream } = await import('get-stream');
    const stream = new PassThrough();
    const doc = new PDFKit();

    doc.pipe(stream);

    const hoje = new Date().toLocaleDateString('pt-BR');
    doc.fontSize(18).text('Relatório de Boletos', { align: 'center' });
    doc.fontSize(12).text(`Emitido em: ${hoje}`, { align: 'center' });
    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .text('Nome do Sacado', 50, doc.y, { continued: true })
      .text('Lote', 200, doc.y, { continued: true })
      .text('Valor (R$)', 280, doc.y, { continued: true })
      .text('Linha Digitável', 330);
    doc
      .moveTo(50, doc.y + 5)
      .lineTo(550, doc.y + 5)
      .stroke();
    doc.moveDown(0.5);

    let currentY = doc.y;

    boletos.forEach((b) => {
      doc
        .fontSize(10)
        .text(b.payer_name, 50, currentY)
        .text(b.lot.name, 200, currentY)
        .text(`R$ ${Number(b.amount).toFixed(2)}`, 280, currentY)
        .fontSize(9)
        .text(b.digitable_line, 370, currentY, {
          width: 180,
          ellipsis: true
        });
    
      currentY += 15;
    });

    doc.end();
    const buffer = await getStream.buffer(stream);
    return buffer.toString('base64');
  }
}
