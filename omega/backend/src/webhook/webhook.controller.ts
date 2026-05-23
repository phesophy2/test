import { Controller, Post, Get, Body, Param, Headers, Delete, UseGuards } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { StripeHandler } from './handlers/stripe.handler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly stripeHandler: StripeHandler,
  ) {}

  @Post('stripe')
  async handleStripe(@Body() body: any, @Headers('stripe-signature') signature: string) {
    return this.stripeHandler.handle(body, signature);
  }

  @Post('paypal')
  async handlePayPal(@Body() body: any) {
    console.log('PayPal webhook received:', body);
    return { received: true };
  }

  @Post('wing')
  async handleWing(@Body() body: any) {
    console.log('Wing webhook received:', body);
    return { received: true };
  }

  @Post('aba')
  async handleABA(@Body() body: any) {
    console.log('ABA webhook received:', body);
    return { received: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerWebhook(@Body() body: { tenantId: string; url: string; events: string[] }) {
    return this.webhookService.registerWebhook(body.tenantId, body.url, body.events);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':webhookId')
  async unregisterWebhook(@Param('webhookId') webhookId: string) {
    return this.webhookService.unregisterWebhook(webhookId);
  }

  @Get('events')
  async getWebhookEvents() {
    return this.webhookService.getWebhookEvents();
  }
}
