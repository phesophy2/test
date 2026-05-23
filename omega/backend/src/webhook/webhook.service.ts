import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  private webhookUrls: Map<string, string[]> = new Map();

  registerWebhook(tenantId: string, url: string, events: string[]) {
    const key = `${tenantId}_${url}`;
    this.webhookUrls.set(key, events);
    return { success: true, webhookId: key };
  }

  unregisterWebhook(webhookId: string) {
    this.webhookUrls.delete(webhookId);
    return { success: true };
  }

  async triggerWebhook(tenantId: string, event: string, data: any) {
    const promises = [];
    for (const [id, events] of this.webhookUrls.entries()) {
      if (events.includes(event) && id.startsWith(`${tenantId}_`)) {
        const url = id.split('_')[1];
        promises.push(
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, data, timestamp: new Date() }),
          }).catch(err => console.error(`Webhook failed for ${url}:`, err))
        );
      }
    }
    await Promise.all(promises);
    return { triggered: promises.length };
  }

  getWebhookEvents() {
    return [
      'post.created',
      'post.published',
      'post.failed',
      'account.added',
      'account.updated',
      'account.deleted',
      'farming.started',
      'farming.stopped',
      'payment.received',
      'subscription.updated',
      'user.registered',
      'user.logged_in',
      'achievement.unlocked',
      'alert.triggered',
    ];
  }
}
