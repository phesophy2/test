import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('caption')
  async generateCaption(@Body() body: { topic: string; tone: string; platform: string }) {
    return this.aiService.generateCaption(body.topic, body.tone, body.platform);
  }

  @Post('hashtags')
  async generateHashtags(@Body() body: { topic: string; count: number }) {
    return this.aiService.generateHashtags(body.topic, body.count || 10);
  }

  @Post('comment')
  async generateComment(@Body() body: { postContent: string }) {
    return this.aiService.generateComment(body.postContent);
  }

  @Post('image')
  async generateImage(@Body() body: { prompt: string }) {
    return this.aiService.generateImage(body.prompt);
  }

  @Post('sentiment')
  async analyzeSentiment(@Body() body: { text: string }) {
    return this.aiService.analyzeSentiment(body.text);
  }
}
