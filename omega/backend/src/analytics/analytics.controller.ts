import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.analyticsService.getDashboardStats(tenantId, userId);
  }

  @Get('posts')
  async getPostAnalytics(@Query('tenantId') tenantId: string, @Query('userId') userId: string, @Query('period') period: string) {
    return this.analyticsService.getPostAnalytics(tenantId, userId, period);
  }

  @Get('top-posts')
  async getTopPosts(@Query('tenantId') tenantId: string, @Query('userId') userId: string, @Query('limit') limit: string) {
    return this.analyticsService.getTopPosts(tenantId, userId, limit ? parseInt(limit) : 10);
  }

  @Get('platforms')
  async getPlatformStats(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.analyticsService.getPlatformStats(tenantId, userId);
  }

  @Get('export')
  async exportReport(@Query('tenantId') tenantId: string, @Query('userId') userId: string, @Query('format') format: string) {
    return this.analyticsService.exportReport(tenantId, userId, format);
  }

  @Get('prediction')
  async getPrediction(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.analyticsService.getPrediction(tenantId, userId);
  }
}
