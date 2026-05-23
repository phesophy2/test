import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column()
  planId: string;

  @Column()
  planName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  interval: string; // month, quarter, year

  @Column()
  status: string; // active, cancelled, expired, past_due

  @Column({ type: 'jsonb', default: {} })
  features: {
    maxAccounts?: number;
    maxPostsPerDay?: number;
    maxTeamMembers?: number;
    maxStorage?: number;
    aiContent?: boolean;
    advancedAnalytics?: boolean;
    apiAccess?: boolean;
    prioritySupport?: boolean;
    whiteLabel?: boolean;
  };

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelledReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
