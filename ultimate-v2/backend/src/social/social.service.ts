import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/Account.entity';
import { Post } from '../entities/Post.entity';
import { facebookAutomation, tiktokAutomation, instagramAutomation } from '../automation';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getAccounts(tenantId: string, userId: string) {
    return this.accountRepository.find({ where: { tenantId, userId } });
  }

  async addAccount(tenantId: string, userId: string, data: any) {
    const account = this.accountRepository.create({ tenantId, userId, ...data });
    return this.accountRepository.save(account);
  }

  async updateAccount(id: string, data: any) {
    await this.accountRepository.update(id, data);
    return this.accountRepository.findOne({ where: { id } });
  }

  async deleteAccount(id: string) {
    await this.accountRepository.delete(id);
    return { success: true };
  }

  async startFarming(accountIds: string[]) {
    for (const id of accountIds) {
      await this.accountRepository.update(id, { status: 'running' });
      // Start automation in background
      setImmediate(async () => {
        const account = await this.accountRepository.findOne({ where: { id } });
        if (account) {
          await this.runAutomation(account);
        }
      });
    }
    return { success: true, started: accountIds.length };
  }

  async stopFarming(accountIds: string[]) {
    for (const id of accountIds) {
      await this.accountRepository.update(id, { status: 'idle' });
    }
    return { success: true, stopped: accountIds.length };
  }

  async createPost(tenantId: string, userId: string, data: any) {
    const post = this.postRepository.create({ tenantId, userId, ...data, status: 'scheduled' });
    const saved = await this.postRepository.save(post);
    
    if (!data.scheduledFor || new Date(data.scheduledFor) <= new Date()) {
      await this.publishPost(saved.id);
    }
    
    return saved;
  }

  async publishPost(postId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) return { success: false };
    
    const account = await this.accountRepository.findOne({ where: { id: post.accountId } });
    if (!account) return { success: false };
    
    try {
      let result;
      switch (post.platform) {
        case 'facebook':
          result = await facebookAutomation.post(post.accountId, account.email, account.password, post);
          break;
        case 'tiktok':
          result = await tiktokAutomation.post(post.accountId, account.email, account.password, post);
          break;
        case 'instagram':
          result = await instagramAutomation.post(post.accountId, account.email, account.password, post);
          break;
      }
      
      await this.postRepository.update(postId, { status: 'published', postedAt: new Date() });
      return { success: true, result };
    } catch (error) {
      await this.postRepository.update(postId, { status: 'failed' });
      return { success: false, error: error.message };
    }
  }

  async getPosts(tenantId: string, userId: string) {
    return this.postRepository.find({ where: { tenantId, userId }, order: { createdAt: 'DESC' } });
  }

  private async runAutomation(account: Account) {
    // Continuous farming logic
    while (true) {
      const current = await this.accountRepository.findOne({ where: { id: account.id } });
      if (current.status !== 'running') break;
      
      // Perform actions like like, comment, follow based on settings
      await new Promise(r => setTimeout(r, 60000)); // Wait 1 minute
    }
  }
}
