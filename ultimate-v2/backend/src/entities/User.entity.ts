import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
