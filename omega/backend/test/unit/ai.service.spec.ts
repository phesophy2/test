import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../../src/ai/ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  describe('generateCaption', () => {
    it('should generate a caption', async () => {
      const result = await service.generateCaption('technology', 'casual', 'facebook');
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('caption');
    });
  });

  describe('generateHashtags', () => {
    it('should generate hashtags', async () => {
      const result = await service.generateHashtags('technology', 5);
      expect(result).toHaveProperty('success', true);
      expect(result.hashtags).toBeInstanceOf(Array);
    });
  });

  describe('sentimentAnalysis', () => {
    it('should analyze sentiment', async () => {
      const result = await service.sentimentAnalysis('This is great!');
      expect(result).toHaveProperty('success', true);
      expect(['positive', 'negative', 'neutral']).toContain(result.sentiment);
    });
  });
});
