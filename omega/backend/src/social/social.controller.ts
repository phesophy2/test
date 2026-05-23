import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private socialService: SocialService) {}

  // Accounts
  @Get('accounts')
  async getAccounts(@Query('tenantId') tenantId: string, @Query('userId') userId: string, @Query('platform') platform?: string) {
    return this.socialService.getAccounts(tenantId, userId, platform);
  }

  @Post('accounts')
  async addAccount(@Body() body: { tenantId: string; userId: string; data: any }) {
    return this.socialService.addAccount(body.tenantId, body.userId, body.data);
  }

  @Put('accounts/:id')
  async updateAccount(@Param('id') id: string, @Body() data: any) {
    return this.socialService.updateAccount(id, data);
  }

  @Delete('accounts/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.socialService.deleteAccount(id);
  }

  // Farming
  @Post('farming/start')
  async startFarming(@Body() body: { accountIds: string[] }) {
    return this.socialService.startFarming(body.accountIds);
  }

  @Post('farming/stop')
  async stopFarming(@Body() body: { accountIds: string[] }) {
    return this.socialService.stopFarming(body.accountIds);
  }

  // Posts
  @Post('posts')
  async createPost(@Body() body: { tenantId: string; userId: string; data: any }) {
    return this.socialService.createPost(body.tenantId, body.userId, body.data);
  }

  @Post('posts/:id/publish')
  async publishPost(@Param('id') id: string) {
    return this.socialService.publishPost(id);
  }

  @Post('posts/:id/schedule')
  async schedulePost(@Param('id') id: string, @Body() body: { scheduledFor: Date }) {
    return this.socialService.schedulePost(id, body.scheduledFor);
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    return this.socialService.deletePost(id);
  }

  @Get('posts')
  async getPosts(@Query('tenantId') tenantId: string, @Query('userId') userId: string, @Query('status') status?: string) {
    return this.socialService.getPosts(tenantId, userId, status);
  }

  @Get('posts/:id/analytics')
  async getPostAnalytics(@Param('id') id: string) {
    return this.socialService.getPostAnalytics(id);
  }

  // Bulk Operations
  @Post('posts/bulk')
  async bulkCreatePosts(@Body() body: { tenantId: string; userId: string; postsData: any[] }) {
    return this.socialService.bulkCreatePosts(body.tenantId, body.userId, body.postsData);
  }

  @Delete('posts/bulk')
  async bulkDeletePosts(@Body() body: { postIds: string[] }) {
    return this.socialService.bulkDeletePosts(body.postIds);
  }
}
