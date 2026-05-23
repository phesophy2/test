import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { Account } from '../entities/Account.entity';
import { Post } from '../entities/Post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Post])],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
