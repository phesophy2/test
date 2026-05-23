import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkerService } from './worker.service';
import { FarmingProcessor } from './processors/farming.processor';
import { PostingProcessor } from './processors/posting.processor';
import { EmailProcessor } from './processors/email.processor';
import { AnalyticsProcessor } from './processors/analytics.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'farming' },
      { name: 'posting' },
      { name: 'email' },
      { name: 'analytics' },
    ),
  ],
  providers: [WorkerService, FarmingProcessor, PostingProcessor, EmailProcessor, AnalyticsProcessor],
  exports: [WorkerService],
})
export class WorkerModule {}
