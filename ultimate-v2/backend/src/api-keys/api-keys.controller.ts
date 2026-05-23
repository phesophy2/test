import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @Post('generate')
  async generateApiKey(@Body() body: { tenantId: string; userId: string; name: string; permissions: string[] }) {
    return this.apiKeysService.generateApiKey(body.tenantId, body.userId, body.name, body.permissions);
  }

  @Get(':tenantId/:userId')
  async getApiKeys(@Param('tenantId') tenantId: string, @Param('userId') userId: string) {
    return this.apiKeysService.getApiKeys(tenantId, userId);
  }

  @Delete(':id')
  async revokeApiKey(@Param('id') id: string) {
    return this.apiKeysService.revokeApiKey(id);
  }
}
