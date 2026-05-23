import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) {}

  // Products
  @Get('products')
  async getProducts(@Query('tenantId') tenantId: string, @Query('category') category?: string) {
    return this.marketplaceService.getProducts(tenantId, category);
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return this.marketplaceService.getProduct(id);
  }

  @Post('products')
  async createProduct(@Body() body: { tenantId: string; userId: string; data: any }) {
    return this.marketplaceService.createProduct(body.tenantId, body.userId, body.data);
  }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.marketplaceService.updateProduct(id, data);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.marketplaceService.deleteProduct(id);
  }

  // Orders
  @Post('orders')
  async createOrder(@Body() body: { tenantId: string; userId: string; productId: string; paymentMethod: string }) {
    return this.marketplaceService.createOrder(body.tenantId, body.userId, body.productId, body.paymentMethod);
  }

  @Post('orders/:orderId/confirm')
  async confirmOrder(@Param('orderId') orderId: string, @Body() body: { transactionId: string }) {
    return this.marketplaceService.confirmOrder(orderId, body.transactionId);
  }

  @Get('orders')
  async getUserOrders(@Query('tenantId') tenantId: string, @Query('userId') userId: string) {
    return this.marketplaceService.getUserOrders(tenantId, userId);
  }

  @Get('orders/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.marketplaceService.getOrder(orderId);
  }

  @Delete('orders/:orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    return this.marketplaceService.cancelOrder(orderId);
  }

  @Get('categories')
  async getCategories() {
    return this.marketplaceService.getCategories();
  }
}
