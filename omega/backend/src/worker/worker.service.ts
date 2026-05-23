import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WorkerService {
  constructor(
    @InjectQueue('farming') private farmingQueue: Queue,
    @InjectQueue('posting') private postingQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {}

  async addFarmingJob(accountId: string, action: string, data: any) {
    await this.farmingQueue.add('process-farming', { accountId, action, data }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    });
    return { jobId: `farming_${accountId}_${Date.now()}` };
  }

  async addPostingJob(accountId: string, postId: string, platform: string, content: any) {
    await this.postingQueue.add('process-posting', { accountId, postId, platform, content }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 10000 },
      delay: content.scheduledFor ? new Date(content.scheduledFor).getTime() - Date.now() : 0,
    });
    return { jobId: `posting_${postId}_${Date.now()}` };
  }

  async addEmailJob(to: string, subject: string, body: string, type: string) {
    await this.emailQueue.add('process-email', { to, subject, body, type }, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 30000 },
    });
    return { jobId: `email_${Date.now()}` };
  }

  async addAnalyticsJob(tenantId: string, userId: string, period: string) {
    await this.analyticsQueue.add('process-analytics', { tenantId, userId, period });
    return { jobId: `analytics_${tenantId}_${Date.now()}` };
  }

  async getQueueStats() {
    const farmingCount = await this.farmingQueue.getJobCounts();
    const postingCount = await this.postingQueue.getJobCounts();
    const emailCount = await this.emailQueue.getJobCounts();
    const analyticsCount = await this.analyticsQueue.getJobCounts();

    return {
      farming: farmingCount,
      posting: postingCount,
      email: emailCount,
      analytics: analyticsCount,
    };
  }

  async cleanQueues() {
    await this.farmingQueue.clean(86400000, 'completed');
    await this.postingQueue.clean(86400000, 'completed');
    await this.emailQueue.clean(86400000, 'completed');
    await this.analyticsQueue.clean(86400000, 'completed');
    return { success: true };
  }
}
