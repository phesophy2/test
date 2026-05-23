import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('farming')
export class FarmingProcessor {
  @Process('process-farming')
  async handleFarming(job: Job) {
    const { accountId, action, data } = job.data;
    console.log(`Processing farming job for account ${accountId}: ${action}`);
    
    try {
      // Simulate farming action
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update account status in database
      // await this.accountRepository.update(accountId, { lastActivityAt: new Date() });
      
      return { success: true, accountId, action, processedAt: new Date() };
    } catch (error) {
      console.error(`Farming job failed for account ${accountId}:`, error);
      throw error;
    }
  }
}
