import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Invoice } from '../../invoices/entitie/invoice.entity';

@Entity('lotes')
export class Lot {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'nome', length: 100 })
  name: string;

  @Column({ name: 'ativo', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  created_at: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.lot)
  invoices: Invoice[];
}
