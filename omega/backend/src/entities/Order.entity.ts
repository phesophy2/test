import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentMethod: string;

  @Column({ default: 'pending' })
  status: string; // pending, paid, delivered, cancelled, refunded

  @Column({ type: 'jsonb', nullable: true })
  deliveryData: any;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
