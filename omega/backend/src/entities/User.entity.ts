import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';

@Entity('users')
@Index(['email', 'tenantId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ default: 'free' })
  subscriptionTier: string;

  @Column({ nullable: true })
  subscriptionExpires: Date;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'jsonb', default: {} })
  settings: any;

  @Column({ type: 'jsonb', default: {} })
  permissions: string[];

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastLoginIp: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
