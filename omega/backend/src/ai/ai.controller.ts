import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate/caption')
  async generateCaption(@Body() body: { topic: string; tone: string; platform: string; model?: string }) {
    return this.aiService.generateCaption(body.topic, body.tone, body.platform, body.model);
  }

  @Post('generate/hashtags')
  async generateHashtags(@Body() body: { topic: string; count: number; model?: string }) {
    return this.aiService.generateHashtags(body.topic, body.count || 10, body.model);
  }

  @Post('generate/image')
  async generateImage(@Body() body: { prompt: string; size?: string }) {
    return this.aiService.generateImage(body.prompt, body.size);
  }

  @Post('generate/video')
  async generateVideo(@Body() body: { prompt: string; duration?: number }) {
    return this.aiService.generateVideo(body.prompt, body.duration);
  }

  @Post('generate/voice')
  async generateVoice(@Body() body: { text: string; voice?: string }) {
    return this.aiService.generateVoice(body.text, body.voice);
  }

  @Post('analyze/image')
  async analyzeImage(@Body() body: { imageUrl: string }) {
    return this.aiService.analyzeImage(body.imageUrl);
  }

  @Post('analyze/video')
  async analyzeVideo(@Body() body: { videoUrl: string }) {
    return this.aiService.analyzeVideo(body.videoUrl);
  }

  @Post('analyze/sentiment')
  async sentimentAnalysis(@Body() body: { text: string }) {
    return this.aiService.sentimentAnalysis(body.text);
  }

  @Post('translate')
  async translate(@Body() body: { text: string; targetLanguage: string }) {
    return this.aiService.translateText(body.text, body.targetLanguage);
  }

  @Post('summarize')
  async summarize(@Body() body: { text: string; maxLength?: number }) {
    return this.aiService.summarizeText(body.text, body.maxLength);
  }

  @Post('generate/script')
  async generateScript(@Body() body: { topic: string; platform: string; duration?: number }) {
    return this.aiService.generateScript(body.topic, body.platform, body.duration);
  }
}
