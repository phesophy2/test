import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('accounts')
@Index(['tenantId', 'platform', 'status'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column()
  platform: string; // facebook, tiktok, instagram, youtube, twitter, linkedin, pinterest, snapchat, telegram, discord, whatsapp, wechat, line

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  proxy: string;

  @Column({ type: 'text', nullable: true })
  cookies: string;

  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: 'idle' })
  status: string; // idle, running, error, banned

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    followers?: number;
    following?: number;
    posts?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };

  @Column({ type: 'jsonb', default: {} })
  settings: {
    autoLike?: boolean;
    autoComment?: boolean;
    autoFollow?: boolean;
    autoPost?: boolean;
    postFrequency?: number;
    workingHours?: string[];
  };

  @Column({ nullable: true })
  lastActivityAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
