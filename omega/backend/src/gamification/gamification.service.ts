import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gamification } from '../entities/Gamification.entity';
import { User } from '../entities/User.entity';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(Gamification)
    private gamificationRepository: Repository<Gamification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserStats(tenantId: string, userId: string) {
    let stats = await this.gamificationRepository.findOne({ where: { tenantId, userId } });
    if (!stats) {
      stats = await this.gamificationRepository.save({
        tenantId,
        userId,
        points: 0,
        level: 1,
        xp: 0,
        achievements: [],
        badges: [],
        stats: {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
          totalAccounts: 0,
          totalFarmingHours: 0,
          streak: 0,
          longestStreak: 0,
        },
        rank: 0,
      });
    }
    return stats;
  }

  async addPoints(tenantId: string, userId: string, points: number, reason: string) {
    const stats = await this.getUserStats(tenantId, userId);
    const newPoints = stats.points + points;
    const newXp = stats.xp + points;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const levelUp = newLevel > stats.level;

    await this.gamificationRepository.update(stats.id, {
      points: newPoints,
      xp: newXp,
      level: newLevel,
      lastActiveAt: new Date(),
    });

    if (levelUp) {
      await this.addAchievement(tenantId, userId, 'level_up', `Reached Level ${newLevel}`);
    }

    return { points: newPoints, level: newLevel, levelUp, reason };
  }

  async addAchievement(tenantId: string, userId: string, achievementId: string, achievementName: string) {
    const stats = await this.getUserStats(tenantId, userId);
    const existing = stats.achievements.find((a) => a.id === achievementId);
    if (existing) return stats;

    const newAchievements = [...stats.achievements, { id: achievementId, name: achievementName, earnedAt: new Date() }];
    await this.gamificationRepository.update(stats.id, { achievements: newAchievements });
    await this.addPoints(tenantId, userId, 100, `Achievement: ${achievementName}`);
    return { achievement: { id: achievementId, name: achievementName } };
  }

  async addBadge(tenantId: string, userId: string, badgeId: string, badgeName: string, badgeIcon: string) {
    const stats = await this.getUserStats(tenantId, userId);
    const existing = stats.badges.find((b) => b.id === badgeId);
    if (existing) return stats;

    const newBadges = [...stats.badges, { id: badgeId, name: badgeName, icon: badgeIcon, earnedAt: new Date() }];
    await this.gamificationRepository.update(stats.id, { badges: newBadges });
    return { badge: { id: badgeId, name: badgeName, icon: badgeIcon } };
  }

  async updateStats(tenantId: string, userId: string, action: string) {
    const stats = await this.getUserStats(tenantId, userId);
    const newStats = { ...stats.stats };

    switch (action) {
      case 'post_created':
        newStats.totalPosts = (newStats.totalPosts || 0) + 1;
        await this.addPoints(tenantId, userId, 10, 'Created a post');
        if (newStats.totalPosts === 10) await this.addAchievement(tenantId, userId, 'first_10_posts', 'Getting Started');
        if (newStats.totalPosts === 100) await this.addAchievement(tenantId, userId, 'first_100_posts', 'Content Creator');
        if (newStats.totalPosts === 1000) await this.addAchievement(tenantId, userId, 'first_1000_posts', 'Viral Sensation');
        break;
      case 'like_received':
        newStats.totalLikes = (newStats.totalLikes || 0) + 1;
        await this.addPoints(tenantId, userId, 1, 'Received a like');
        if (newStats.totalLikes === 100) await this.addAchievement(tenantId, userId, 'first_100_likes', 'Getting Popular');
        if (newStats.totalLikes === 1000) await this.addAchievement(tenantId, userId, 'first_1000_likes', 'Trending');
        break;
      case 'comment_received':
        newStats.totalComments = (newStats.totalComments || 0) + 1;
        await this.addPoints(tenantId, userId, 2, 'Received a comment');
        break;
      case 'share_received':
        newStats.totalShares = (newStats.totalShares || 0) + 1;
        await this.addPoints(tenantId, userId, 5, 'Received a share');
        break;
      case 'account_added':
        newStats.totalAccounts = (newStats.totalAccounts || 0) + 1;
        await this.addPoints(tenantId, userId, 50, 'Added an account');
        if (newStats.totalAccounts === 5) await this.addAchievement(tenantId, userId, 'five_accounts', 'Account Collector');
        if (newStats.totalAccounts === 20) await this.addAchievement(tenantId, userId, 'twenty_accounts', 'Power User');
        break;
    }

    const today = new Date().toDateString();
    const lastActive = stats.lastActiveAt ? new Date(stats.lastActiveAt).toDateString() : null;
    if (lastActive === today) {
      // already active today
    } else if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
      newStats.streak = (newStats.streak || 0) + 1;
      newStats.longestStreak = Math.max(newStats.longestStreak || 0, newStats.streak);
      await this.addPoints(tenantId, userId, 5, `Day ${newStats.streak} streak!`);
      if (newStats.streak === 7) await this.addAchievement(tenantId, userId, 'week_streak', 'Weekly Warrior');
      if (newStats.streak === 30) await this.addAchievement(tenantId, userId, 'month_streak', 'Monthly Master');
      if (newStats.streak === 365) await this.addAchievement(tenantId, userId, 'year_streak', 'Annual Champion');
    } else {
      newStats.streak = 1;
    }

    await this.gamificationRepository.update(stats.id, { stats: newStats, lastActiveAt: new Date() });
    return { success: true, action };
  }

  async getLeaderboard(tenantId: string, limit: number = 50) {
    const users = await this.gamificationRepository.find({ where: { tenantId }, order: { points: 'DESC' }, take: limit });
    const leaderboard = [];
    for (let i = 0; i < users.length; i++) {
      const user = await this.userRepository.findOne({ where: { id: users[i].userId } });
      leaderboard.push({
        rank: i + 1,
        userId: users[i].userId,
        name: user?.fullName || user?.email,
        points: users[i].points,
        level: users[i].level,
        achievements: users[i].achievements.length,
      });
    }
    return leaderboard;
  }

  async getAchievements() {
    return [
      { id: 'first_post', name: 'First Post', description: 'Create your first post', points: 50, icon: '📝' },
      { id: 'first_10_posts', name: 'Getting Started', description: 'Create 10 posts', points: 100, icon: '📊' },
      { id: 'first_100_posts', name: 'Content Creator', description: 'Create 100 posts', points: 500, icon: '🏆' },
      { id: 'first_1000_posts', name: 'Viral Sensation', description: 'Create 1000 posts', points: 2000, icon: '🌟' },
      { id: 'first_like', name: 'First Like', description: 'Receive your first like', points: 10, icon: '❤️' },
      { id: 'first_100_likes', name: 'Getting Popular', description: 'Receive 100 likes', points: 200, icon: '🔥' },
      { id: 'first_1000_likes', name: 'Trending', description: 'Receive 1000 likes', points: 1000, icon: '💎' },
      { id: 'first_account', name: 'First Account', description: 'Add your first account', points: 50, icon: '👤' },
      { id: 'five_accounts', name: 'Account Collector', description: 'Add 5 accounts', points: 250, icon: '👥' },
      { id: 'twenty_accounts', name: 'Power User', description: 'Add 20 accounts', points: 1000, icon: '⭐' },
      { id: 'week_streak', name: 'Weekly Warrior', description: '7 day streak', points: 500, icon: '📅' },
      { id: 'month_streak', name: 'Monthly Master', description: '30 day streak', points: 2000, icon: '📆' },
      { id: 'year_streak', name: 'Annual Champion', description: '365 day streak', points: 10000, icon: '🏅' },
      { id: 'level_10', name: 'Level 10', description: 'Reach level 10', points: 1000, icon: '🎖️' },
      { id: 'level_50', name: 'Level 50', description: 'Reach level 50', points: 5000, icon: '🏆' },
      { id: 'level_100', name: 'Level 100', description: 'Reach level 100', points: 10000, icon: '👑' },
    ];
  }
}
