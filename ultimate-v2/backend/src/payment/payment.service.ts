import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from '../entities/Payment.entity';
import { Subscription } from '../entities/Subscription.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any });
  }

  async createStripePayment(amount: number, currency: string, userId: string, tenantId: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { userId, tenantId },
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

  async createWingPayment(amount: number, orderId: string, customerPhone: string) {
    // Wing API integration
    const paymentUrl = `https://pay.wingbank.com.kh/pay?order=${orderId}&amount=${amount}&phone=${customerPhone}`;
    return { paymentUrl, orderId, amount };
  }

  async createABAPayment(amount: number, orderId: string, customerEmail: string) {
    // ABA API integration
    const paymentUrl = `https://pay.ababank.com/pay?order=${orderId}&amount=${amount}&email=${customerEmail}`;
    return { paymentUrl, orderId, amount };
  }

  async createCryptoPayment(amount: number, currency: string, network: string = 'BEP-20') {
    const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4';
    return { walletAddress, network, amount, currency };
  }

  async confirmPayment(paymentId: string, transactionId: string) {
    await this.paymentRepository.update(paymentId, {
      status: 'completed',
      metadata: { transactionId, completedAt: new Date() }
    });
    return { success: true };
  }

  async createSubscription(userId: string, tenantId: string, planId: string, planName: string, amount: number, interval: string) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (interval === 'year' ? 12 : 1));

    const subscription = await this.subscriptionRepository.save({
      tenantId,
      userId,
      planId,
      planName,
      amount,
      currency: 'USD',
      interval,
      status: 'active',
      startDate,
      endDate,
    });

    return subscription;
  }

  async cancelSubscription(subscriptionId: string) {
    await this.subscriptionRepository.update(subscriptionId, {
      status: 'cancelled',
      cancelledAt: new Date()
    });
    return { success: true };
  }
}
