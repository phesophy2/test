import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('stats')
  async getUserStats(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.gamificationService.getUserStats(tenantId, userId);
  }

  @Post('points')
  async addPoints(@Body() body: { tenantId: string; userId: string; points: number; reason: string }) {
    return this.gamificationService.addPoints(body.tenantId, body.userId, body.points, body.reason);
  }

  @Post('action')
  async updateStats(@Body() body: { tenantId: string; userId: string; action: string }) {
    return this.gamificationService.updateStats(body.tenantId, body.userId, body.action);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('tenantId') tenantId: string, @Query('limit') limit: string) {
    return this.gamificationService.getLeaderboard(tenantId, limit ? parseInt(limit) : 50);
  }

  @Get('achievements')
  async getAchievements() {
    return this.gamificationService.getAchievements();
  }
}
