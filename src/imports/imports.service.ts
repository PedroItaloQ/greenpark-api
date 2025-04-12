import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { Import } from './entitie/import.entity';
import { CreateImportDto } from './dto/create-import.dto';
import { Invoice } from 'src/invoices/entitie/invoice.entity';
import { Lot } from 'src/lots/entitie/lot.entity';
const PDFKit = require('pdfkit');
import * as getStream from 'get-stream';
import { PassThrough } from 'stream';

@Injectable()
export class ImportsService {
  constructor(
    @InjectRepository(Import)
    private importRepo: Repository<Import>,

    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,

    @InjectRepository(Lot)
    private lotRepo: Repository<Lot>,
  ) { }

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
              if (!loteEncontrado) return;
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

  async processPDF(file: Express.Multer.File) {
    try {
      const { PDFDocument } = await import('pdf-lib');
      const boletos = await this.invoiceRepo.find({ order: { order: 'ASC' } });
      if (!boletos.length) throw new NotFoundException('Nenhum boleto encontrado.');

      const pdfBytes = fs.readFileSync(file.path);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const outputDir = path.join(process.cwd(), 'boletos-pdf');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      const numPages = pdfDoc.getPageCount();
      const boletosValidos = boletos.slice(0, numPages);

      for (let i = 0; i < boletosValidos.length; i++) {
        const boleto = boletosValidos[i];
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        const newPdfBytes = await newPdf.save();
        fs.writeFileSync(path.join(outputDir, `${boleto.id}.pdf`), newPdfBytes);
      }

      return {
        mensagem: 'PDF dividido e salvo com sucesso',
        arquivos: boletos.map((b) => `${b.id}.pdf`),
      };
    } catch (err) {
      console.error('[ERRO AO PROCESSAR PDF]', err);
      throw new Error('Erro ao processar PDF: ' + err.message);
    }
  }

  async gerarRelatorioPDF(): Promise<string> {
    const boletos = await this.invoiceRepo.find({
      relations: ['lot'],
      order: { created_at: 'DESC' },
    });

    const doc = new PDFKit();
    const stream = new PassThrough();
    doc.pipe(stream);

    doc.fontSize(16).text('Relatório de Boletos', { align: 'center' });
    doc.moveDown();

    boletos.forEach((b) => {
      doc.fontSize(10).text(
        `${b.id} | ${b.payer_name} | ${b.lot.name} | R$ ${b.amount} | ${b.digitable_line}`,
      );
    });

    doc.end();
    const buffer = await getStream.buffer(stream);
    return buffer.toString('base64');
  }
}
