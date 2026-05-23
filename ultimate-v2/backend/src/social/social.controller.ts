import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get('accounts')
  async getAccounts(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.socialService.getAccounts(tenantId, userId);
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

  @Post('farming/start')
  async startFarming(@Body() body: { accountIds: string[] }) {
    return this.socialService.startFarming(body.accountIds);
  }

  @Post('farming/stop')
  async stopFarming(@Body() body: { accountIds: string[] }) {
    return this.socialService.stopFarming(body.accountIds);
  }

  @Post('posts')
  async createPost(@Body() body: { tenantId: string; userId: string; data: any }) {
    return this.socialService.createPost(body.tenantId, body.userId, body.data);
  }

  @Post('posts/:id/publish')
  async publishPost(@Param('id') id: string) {
    return this.socialService.publishPost(id);
  }

  @Get('posts')
  async getPosts(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.socialService.getPosts(tenantId, userId);
  }
}
