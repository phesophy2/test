import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('mailboxes')
export class Mailbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  domain: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  soldTo: string;

  @Column('decimal', { nullable: true })
  soldPrice: number;

  @CreateDateColumn()
  createdAt: Date;
}
