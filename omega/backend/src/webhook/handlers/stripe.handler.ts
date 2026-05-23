import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeHandler {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
  }

  async handle(payload: any, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoiceFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSucceeded(paymentIntent: any) {
    console.log('Payment succeeded:', paymentIntent.id);
    // Update order status in database
    // await this.orderRepository.update(
    //   { paymentId: paymentIntent.id },
    //   { status: 'paid', paidAt: new Date() }
    // );
  }

  private async handlePaymentFailed(paymentIntent: any) {
    console.log('Payment failed:', paymentIntent.id);
    // Update order status
  }

  private async handleSubscriptionCreated(subscription: any) {
    console.log('Subscription created:', subscription.id);
    // Create subscription record
  }

  private async handleSubscriptionUpdated(subscription: any) {
    console.log('Subscription updated:', subscription.id);
    // Update subscription record
  }

  private async handleSubscriptionDeleted(subscription: any) {
    console.log('Subscription cancelled:', subscription.id);
    // Update subscription status
  }

  private async handleInvoicePaid(invoice: any) {
    console.log('Invoice paid:', invoice.id);
    // Send receipt email
  }

  private async handleInvoiceFailed(invoice: any) {
    console.log('Invoice failed:', invoice.id);
    // Send notification
  }
}
