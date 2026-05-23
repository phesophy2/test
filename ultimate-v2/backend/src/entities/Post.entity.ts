import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('posts')
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
  type: string; // post, reel, story, video

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  hashtags: string[];

  @Column({ nullable: true })
  mediaUrl: string;

  @Column({ type: 'jsonb', default: {} })
  mediaUrls: string[];

  @Column({ nullable: true })
  scheduledFor: Date;

  @Column({ nullable: true })
  postedAt: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'jsonb', default: {} })
  analytics: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };

  @CreateDateColumn()
  createdAt: Date;
}
