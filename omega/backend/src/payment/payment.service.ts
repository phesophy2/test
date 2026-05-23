import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from '../entities/Payment.entity';
import { Subscription } from '../entities/Subscription.entity';
import { User } from '../entities/User.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
  }

  // Stripe Payment
  async createStripePayment(amount: number, currency: string, userId: string, tenantId: string, planId: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { userId, tenantId, planId },
    });

    const payment = await this.paymentRepository.save({
      tenantId,
      userId,
      paymentId: paymentIntent.id,
      method: 'stripe',
      amount,
      currency,
      status: 'pending',
    });

    return { clientSecret: paymentIntent.client_secret, paymentId: payment.id };
  }

  // PayPal Payment
  async createPayPalPayment(amount: number, currency: string, userId: string, tenantId: string) {
    // PayPal API integration
    return { approvalUrl: `https://www.paypal.com/checkoutnow?token=paypal_token_${Date.now()}`, paymentId: `paypal_${Date.now()}` };
  }

  // Wing Payment (Cambodia)
  async createWingPayment(amount: number, orderId: string, customerPhone: string) {
    const paymentUrl = `https://pay.wingbank.com.kh/pay?order=${orderId}&amount=${amount}&phone=${customerPhone}`;
    return { paymentUrl, orderId, amount };
  }

  // ABA Payment (Cambodia)
  async createABAPayment(amount: number, orderId: string, customerEmail: string) {
    const paymentUrl = `https://pay.ababank.com/pay?order=${orderId}&amount=${amount}&email=${customerEmail}`;
    return { paymentUrl, orderId, amount };
  }

  // KHQR (Bakong) Payment
  async createKHQRPayment(amount: number, merchantName: string) {
    const khqrData = `KHQR|${merchantName}|${amount}|KHR|https://khmerghost.com`;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(khqrData)}&chs=300x300`;
    return { qrData: khqrData, qrUrl, amount };
  }

  // Crypto Payment (USDT, BTC, ETH)
  async createCryptoPayment(amount: number, currency: string, network: string = 'BEP-20') {
    const walletAddresses = {
      'USDT': { 'BEP-20': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4', 'TRC-20': 'TKnz7VgYJYxQWp8QjJkQ9mQnZpYmRwXyZz' },
      'BTC': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      'ETH': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
    };
    return { walletAddress: walletAddresses[currency]?.[network] || walletAddresses[currency], network, amount, currency };
  }

  // Alipay Payment
  async createAlipayPayment(amount: number, orderId: string) {
    return { paymentUrl: `https://global.alipay.com/checkout?orderId=${orderId}&amount=${amount}`, orderId };
  }

  // WeChat Pay
  async createWeChatPayment(amount: number, orderId: string) {
    return { qrCode: `https://pay.weixin.qq.com/qr/${orderId}`, orderId };
  }

  // Confirm Payment
  async confirmPayment(paymentId: string, transactionId: string) {
    await this.paymentRepository.update(paymentId, {
      status: 'completed',
      metadata: { transactionId },
    });
    // Update completedAt timestamp separately
    await this.paymentRepository.update(paymentId, { completedAt: new Date() });
    return { success: true };
  }

  // Create Subscription
  async createSubscription(userId: string, tenantId: string, planId: string, planName: string, amount: number, interval: string) {
    const startDate = new Date();
    const endDate = new Date();
    if (interval === 'month') endDate.setMonth(endDate.getMonth() + 1);
    if (interval === 'quarter') endDate.setMonth(endDate.getMonth() + 3);
    if (interval === 'year') endDate.setFullYear(endDate.getFullYear() + 1);

    const features = this.getPlanFeatures(planId);

    const subscription = await this.subscriptionRepository.save({
      tenantId,
      userId,
      planId,
      planName,
      amount,
      currency: 'USD',
      interval,
      status: 'active',
      features,
      startDate,
      endDate,
    });

    await this.userRepository.update(userId, { subscriptionTier: planId, subscriptionExpires: endDate });

    return subscription;
  }

  private getPlanFeatures(planId: string) {
    const plans = {
      starter: { maxAccounts: 10, maxPostsPerDay: 50, maxTeamMembers: 1, maxStorage: 5, aiContent: false, advancedAnalytics: false, apiAccess: false, prioritySupport: false, whiteLabel: false },
      professional: { maxAccounts: 100, maxPostsPerDay: 500, maxTeamMembers: 5, maxStorage: 50, aiContent: true, advancedAnalytics: false, apiAccess: false, prioritySupport: false, whiteLabel: false },
      business: { maxAccounts: 1000, maxPostsPerDay: 5000, maxTeamMembers: 20, maxStorage: 500, aiContent: true, advancedAnalytics: true, apiAccess: true, prioritySupport: false, whiteLabel: false },
      enterprise: { maxAccounts: 10000, maxPostsPerDay: 50000, maxTeamMembers: 100, maxStorage: 5000, aiContent: true, advancedAnalytics: true, apiAccess: true, prioritySupport: true, whiteLabel: false },
      ultimate: { maxAccounts: 100000, maxPostsPerDay: 500000, maxTeamMembers: 1000, maxStorage: 50000, aiContent: true, advancedAnalytics: true, apiAccess: true, prioritySupport: true, whiteLabel: true },
    };
    return plans[planId] || plans.starter;
  }

  // Cancel Subscription
  async cancelSubscription(subscriptionId: string) {
    await this.subscriptionRepository.update(subscriptionId, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });
    return { success: true };
  }

  // Get Payment Methods
  getPaymentMethods() {
    return {
      cambodia: ['Wing', 'ABA', 'TrueMoney', 'Pi Pay', 'KHQR', 'AMK'],
      asia: ['Alipay', 'WeChat Pay', 'Paytm', 'GrabPay', 'ShopeePay', 'Dana', 'GCash'],
      global: ['Visa', 'Mastercard', 'American Express', 'Discover', 'JCB', 'UnionPay'],
      crypto: ['USDT (BEP-20)', 'USDT (TRC-20)', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'SHIB'],
      digital: ['PayPal', 'Stripe', 'Square', 'Apple Pay', 'Google Pay', 'Samsung Pay'],
    };
  }
}
