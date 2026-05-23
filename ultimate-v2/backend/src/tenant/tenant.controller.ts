import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get(':subdomain')
  async getTenant(@Param('subdomain') subdomain: string) {
    return this.tenantService.getTenant(subdomain);
  }

  @UseGuards(JwtAuthGuard)
  @Put('settings')
  async updateSettings(@Body() body: { tenantId: string; settings: any }) {
    return this.tenantService.updateTenant(body.tenantId, { settings: body.settings });
  }
}
