import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  subdomain: string;

  @Column({ nullable: true })
  customDomain: string;

  @Column({ type: 'jsonb', default: {} })
  branding: {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    companyName?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
  };

  @Column({ type: 'jsonb', default: {} })
  settings: {
    timezone?: string;
    dateFormat?: string;
    currency?: string;
    language?: string;
    features?: string[];
  };

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'jsonb', default: {} })
  limits: {
    maxUsers?: number;
    maxAccounts?: number;
    maxPostsPerDay?: number;
    maxStorage?: number;
    maxApiCalls?: number;
  };

  @Column({ nullable: true })
  region: string;

  @Column({ type: 'simple-array', default: '' })
  allowedIpAddresses: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
