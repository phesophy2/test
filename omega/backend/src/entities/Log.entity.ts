import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('logs')
@Index(['tenantId', 'userId', 'type', 'createdAt'])
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  type: string; // auth, post, account, payment, system, security

  @Column()
  action: string;

  @Column({ type: 'jsonb', default: {} })
  details: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
