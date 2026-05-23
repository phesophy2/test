import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Post } from '../entities/Post.entity';
import { Account } from '../entities/Account.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async getDashboardStats(tenantId: string, userId: string) {
    const totalPosts = await this.postRepository.count({ where: { tenantId, userId } });
    const publishedPosts = await this.postRepository.count({ where: { tenantId, userId, status: 'published' } });
    const totalAccounts = await this.accountRepository.count({ where: { tenantId, userId } });
    const activeAccounts = await this.accountRepository.count({ where: { tenantId, userId, status: 'running' } });
    
    const posts = await this.postRepository.find({ where: { tenantId, userId, status: 'published' } });
    const totalLikes = posts.reduce((sum, p) => sum + (p.analytics?.likes || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.analytics?.comments || 0), 0);
    const totalShares = posts.reduce((sum, p) => sum + (p.analytics?.shares || 0), 0);
    const totalViews = posts.reduce((sum, p) => sum + (p.analytics?.views || 0), 0);
    
    return {
      posts: { total: totalPosts, published: publishedPosts },
      accounts: { total: totalAccounts, active: activeAccounts },
      engagement: { likes: totalLikes, comments: totalComments, shares: totalShares, views: totalViews },
    };
  }

  async getPostAnalytics(tenantId: string, userId: string, period: string = '7d') {
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const posts = await this.postRepository.find({
      where: { tenantId, userId, status: 'published', postedAt: MoreThan(startDate) },
      order: { postedAt: 'ASC' },
    });
    
    const dailyData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayPosts = posts.filter(p => p.postedAt?.toDateString() === date.toDateString());
      dailyData.unshift({
        date: date.toISOString().split('T')[0],
        posts: dayPosts.length,
        likes: dayPosts.reduce((s, p) => s + (p.analytics?.likes || 0), 0),
        comments: dayPosts.reduce((s, p) => s + (p.analytics?.comments || 0), 0),
        shares: dayPosts.reduce((s, p) => s + (p.analytics?.shares || 0), 0),
        views: dayPosts.reduce((s, p) => s + (p.analytics?.views || 0), 0),
      });
    }
    
    return { daily: dailyData, total: dailyData.reduce((s, d) => ({ posts: s.posts + d.posts, likes: s.likes + d.likes, comments: s.comments + d.comments, shares: s.shares + d.shares, views: s.views + d.views }), { posts: 0, likes: 0, comments: 0, shares: 0, views: 0 }) };
  }

  async getTopPosts(tenantId: string, userId: string, limit: number = 10) {
    const posts = await this.postRepository.find({ where: { tenantId, userId, status: 'published' } });
    // Sort posts by likes descending manually
    posts.sort((a, b) => (b.analytics?.likes || 0) - (a.analytics?.likes || 0));
    return posts.slice(0, limit).map(p => ({ id: p.id, content: p.content.substring(0, 100), likes: p.analytics?.likes || 0, comments: p.analytics?.comments || 0, shares: p.analytics?.shares || 0, views: p.analytics?.views || 0 }));
  }

  async getPlatformStats(tenantId: string, userId: string) {
    const platforms = ['facebook', 'tiktok', 'instagram', 'youtube', 'twitter', 'linkedin'];
    const stats = [];
    for (const platform of platforms) {
      const accounts = await this.accountRepository.count({ where: { tenantId, userId, platform } });
      const posts = await this.postRepository.find({ where: { tenantId, userId, platform, status: 'published' } });
      stats.push({
        platform,
        accounts,
        posts: posts.length,
        likes: posts.reduce((s, p) => s + (p.analytics?.likes || 0), 0),
        comments: posts.reduce((s, p) => s + (p.analytics?.comments || 0), 0),
        shares: posts.reduce((s, p) => s + (p.analytics?.shares || 0), 0),
        views: posts.reduce((s, p) => s + (p.analytics?.views || 0), 0),
      });
    }
    return stats;
  }

  async exportReport(tenantId: string, userId: string, format: string = 'csv') {
    const stats = await this.getDashboardStats(tenantId, userId);
    const posts = await this.postRepository.find({ where: { tenantId, userId, status: 'published' } });
    
    if (format === 'csv') {
      const csvRows = [['Date', 'Platform', 'Content', 'Likes', 'Comments', 'Shares', 'Views']];
      for (const post of posts) {
        csvRows.push([
          post.postedAt?.toISOString() || '',
          post.platform,
          post.content.substring(0, 100),
          (post.analytics?.likes ?? 0).toString(),
          (post.analytics?.comments ?? 0).toString(),
          (post.analytics?.shares ?? 0).toString(),
          (post.analytics?.views ?? 0).toString(),
        ]);
      }
      const csv = csvRows.map(row => row.join(',')).join('\n');
      return { csv, filename: `report_${Date.now()}.csv` };
    }
    
    return { json: { stats, posts }, filename: `report_${Date.now()}.json` };
  }

  async getPrediction(tenantId: string, userId: string) {
    const posts = await this.postRepository.find({ where: { tenantId, userId, status: 'published' }, order: { postedAt: 'DESC' }, take: 30 });
    const avgLikes = posts.reduce((s, p) => s + (p.analytics?.likes || 0), 0) / (posts.length || 1);
    const avgComments = posts.reduce((s, p) => s + (p.analytics?.comments || 0), 0) / (posts.length || 1);
    const trend = posts.slice(0, 7).reduce((s, p) => s + (p.analytics?.likes || 0), 0) > posts.slice(7, 14).reduce((s, p) => s + (p.analytics?.likes || 0), 0) ? 'up' : 'down';
    
    return {
      predictedNextPost: { likes: Math.round(avgLikes * (trend === 'up' ? 1.1 : 0.9)), comments: Math.round(avgComments * (trend === 'up' ? 1.1 : 0.9)) },
      bestTimeToPost: '6:00 PM - 9:00 PM',
      bestDayToPost: 'Thursday',
      trend,
      confidence: 85,
    };
  }
}
