import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('payments')
@Index(['tenantId', 'userId', 'status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  paymentId: string;

  @Column()
  method: string; // stripe, paypal, wing, aba, coinbase, binance, alipay, wechat, visa, mastercard

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string; // pending, processing, completed, failed, refunded, chargeback

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    transactionId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    paymentMethodDetails?: any;
    receiptUrl?: string;
    invoiceUrl?: string;
  };

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  refundedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
