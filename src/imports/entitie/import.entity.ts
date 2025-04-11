import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Invoice } from '../../invoices/entitie/invoice.entity';

@Entity('importacoes')
export class Import {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'nome_arquivo', length: 255 })
  file_name: string;

  @CreateDateColumn({ name: 'criado_em' })
  created_at: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.import)
  invoices: Invoice[];
}
