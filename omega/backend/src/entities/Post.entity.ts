import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('posts')
@Index(['tenantId', 'platform', 'status', 'scheduledFor'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column()
  accountId: string;

  @Column()
  platform: string;

  @Column()
  type: string; // post, reel, story, video, image, carousel, live

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  hashtags: string[];

  @Column({ type: 'simple-array', nullable: true })
  mentions: string[];

  @Column({ nullable: true })
  mediaUrl: string;

  @Column({ type: 'jsonb', default: {} })
  mediaUrls: string[];

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    location?: string;
    feeling?: string;
    activity?: string;
    link?: string;
    poll?: any;
  };

  @Column({ nullable: true })
  scheduledFor: Date;

  @Column({ nullable: true })
  postedAt: Date;

  @Column({ default: 'pending' })
  status: string; // pending, scheduled, publishing, published, failed, deleted

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'jsonb', default: {} })
  analytics: {
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    views?: number;
    reach?: number;
    impressions?: number;
    engagement?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
