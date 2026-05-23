import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';
import { Gamification } from '../entities/Gamification.entity';
import { User } from '../entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gamification, User])],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
