import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from '../entities/Payment.entity';
import { Subscription } from '../entities/Subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Subscription])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
