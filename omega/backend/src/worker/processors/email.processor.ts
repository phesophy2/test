import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process()
  async handleEmail(job: Job<any>) {
    this.logger.log(`Processing email job: ${JSON.stringify(job.data)}`);
    // Placeholder: integrate with email service (e.g., SendGrid, SES)
    return { success: true, jobId: job.id };
  }
}
