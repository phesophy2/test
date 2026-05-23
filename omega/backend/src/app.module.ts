import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
// Feature modules
import { AuthModule } from './auth/auth.module';
import { SocialModule } from './social/social.module';
import { CronModule } from './cron/cron.module';
import { WorkerModule } from './worker/worker.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { PaymentModule } from './payment/payment.module';
import { GamificationModule } from './gamification/gamification.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'khmerghost.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    BullModule.forRoot({ redis: { host: process.env.REDIS_HOST, port: +process.env.REDIS_PORT } }),
    AuthModule,
    SocialModule,
    CronModule,
    WorkerModule,
    AnalyticsModule,
    MarketplaceModule,
    PaymentModule,
    GamificationModule,
    AiModule,
  ],
})
export class AppModule {}
