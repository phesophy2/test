import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  apiKey: string;

  @Column()
  name: string;

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[]; // read, write, delete, admin

  @Column({ type: 'jsonb', default: {} })
  rateLimits: {
    perMinute?: number;
    perHour?: number;
    perDay?: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastUsedAt: Date;

  @Column({ nullable: true })
  lastUsedIp: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
