import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string; // email_account, proxy, software, service, template, script

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'jsonb', default: {} })
  images: string[];

  @Column({ type: 'jsonb', default: {} })
  features: string[];

  @Column({ type: 'jsonb', default: {} })
  deliveryData: any; // For digital products

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'int', default: 0 })
  salesCount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
