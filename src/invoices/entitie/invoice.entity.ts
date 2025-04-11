import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Lot } from '../../lots/entitie/lot.entity';
import { Import } from '../../imports/entitie/import.entity';

@Entity('boletos')
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ name: 'nome_sacado', length: 255 })
  payer_name: string;

  @Index()
  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Index()
  @Column({ name: 'linha_digitavel', length: 255 })
  digitable_line: string;

  @Column({ name: 'ativo', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  created_at: Date;

  @ManyToOne(() => Lot, (lot) => lot.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_lote' })
  lot: Lot;

  @ManyToOne(() => Import, (imp) => imp.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_importacao' })
  import: Import;

  @Column({ default: 0 })
  order: number;
}
