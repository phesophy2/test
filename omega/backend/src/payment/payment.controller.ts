import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('stripe/create')
  async createStripePayment(@Body() body: { amount: number; currency: string; userId: string; tenantId: string; planId: string }) {
    return this.paymentService.createStripePayment(body.amount, body.currency, body.userId, body.tenantId, body.planId);
  }

  @Post('paypal/create')
  async createPayPalPayment(@Body() body: { amount: number; currency: string; userId: string; tenantId: string }) {
    return this.paymentService.createPayPalPayment(body.amount, body.currency, body.userId, body.tenantId);
  }

  @Post('wing/create')
  async createWingPayment(@Body() body: { amount: number; orderId: string; customerPhone: string }) {
    return this.paymentService.createWingPayment(body.amount, body.orderId, body.customerPhone);
  }

  @Post('aba/create')
  async createABAPayment(@Body() body: { amount: number; orderId: string; customerEmail: string }) {
    return this.paymentService.createABAPayment(body.amount, body.orderId, body.customerEmail);
  }

  @Post('khqr/create')
  async createKHQRPayment(@Body() body: { amount: number; merchantName: string }) {
    return this.paymentService.createKHQRPayment(body.amount, body.merchantName);
  }

  @Post('crypto/create')
  async createCryptoPayment(@Body() body: { amount: number; currency: string; network: string }) {
    return this.paymentService.createCryptoPayment(body.amount, body.currency, body.network);
  }

  @Post('alipay/create')
  async createAlipayPayment(@Body() body: { amount: number; orderId: string }) {
    return this.paymentService.createAlipayPayment(body.amount, body.orderId);
  }

  @Post('wechat/create')
  async createWeChatPayment(@Body() body: { amount: number; orderId: string }) {
    return this.paymentService.createWeChatPayment(body.amount, body.orderId);
  }

  @Post('confirm')
  async confirmPayment(@Body() body: { paymentId: string; transactionId: string }) {
    return this.paymentService.confirmPayment(body.paymentId, body.transactionId);
  }

  @Post('subscription/create')
  async createSubscription(@Body() body: { userId: string; tenantId: string; planId: string; planName: string; amount: number; interval: string }) {
    return this.paymentService.createSubscription(body.userId, body.tenantId, body.planId, body.planName, body.amount, body.interval);
  }

  @Post('subscription/cancel')
  async cancelSubscription(@Body() body: { subscriptionId: string }) {
    return this.paymentService.cancelSubscription(body.subscriptionId);
  }

  @Get('methods')
  async getPaymentMethods() {
    return this.paymentService.getPaymentMethods();
  }
}
