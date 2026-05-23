import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeHandler } from './handlers/stripe.handler';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, StripeHandler],
})
export class WebhookModule {}
