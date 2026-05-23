import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ai_agents')
export class AIAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  model: string; // gpt-4, claude-3, gemini-pro, llama-3, mistral

  @Column({ type: 'jsonb', default: {} })
  config: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    systemPrompt?: string;
  };

  @Column({ type: 'jsonb', default: {} })
  capabilities: string[]; // content_generation, sentiment_analysis, image_generation, video_analysis, voice_synthesis

  @Column({ type: 'int', default: 0 })
  totalTokensUsed: number;

  @Column({ type: 'int', default: 0 })
  totalRequests: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
