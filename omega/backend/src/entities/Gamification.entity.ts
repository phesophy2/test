import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('gamification')
export class Gamification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @Column({ type: 'jsonb', default: {} })
  achievements: {
    id: string;
    name: string;
    earnedAt: Date;
    nftTokenId?: string;
  }[];

  @Column({ type: 'jsonb', default: {} })
  badges: {
    id: string;
    name: string;
    icon: string;
    earnedAt: Date;
  }[];

  @Column({ type: 'jsonb', default: {} })
  stats: {
    totalPosts?: number;
    totalLikes?: number;
    totalComments?: number;
    totalShares?: number;
    totalAccounts?: number;
    totalFarmingHours?: number;
    streak?: number;
    longestStreak?: number;
  };

  @Column({ type: 'int', default: 0 })
  rank: number;

  @Column({ nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
