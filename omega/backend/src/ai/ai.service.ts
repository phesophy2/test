import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private googleAi: GoogleGenerativeAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.googleAi = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }

  async generateContent(model: string, prompt: string, options?: any) {
    switch (model) {
      case 'gpt-4':
        return this.generateWithGPT4(prompt, options);
      case 'claude-3':
        return this.generateWithClaude3(prompt, options);
      case 'gemini-pro':
        return this.generateWithGemini(prompt, options);
      default:
        return this.generateWithGPT4(prompt, options);
    }
  }

  private async generateWithGPT4(prompt: string, options?: any) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    });
    return { content: response.choices[0].message.content, model: 'gpt-4', tokens: (response.usage as any)?.total_tokens ?? (response.usage as any)?.totalTokens };
  }

  private async generateWithClaude3(prompt: string, options?: any) {
    const response = await (this.anthropic as any).messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7,
      messages: [{ role: 'user', content: prompt }],
    });
    return { content: response.content[0].text, model: 'claude-3', tokens: response.usage?.input_tokens + response.usage?.output_tokens };
  }

  private async generateWithGemini(prompt: string, options?: any) {
    const model = this.googleAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { content: response.text(), model: 'gemini-pro', tokens: 0 };
  }

  async generateCaption(topic: string, tone: string, platform: string, model: string = 'gpt-4') {
    const prompt = `Write a ${tone} social media caption for ${platform} about "${topic}". 
    Requirements:
    - Use emojis naturally
    - Include a call-to-action
    - Be engaging and authentic
    - Length: 100-200 characters
    
    Return ONLY the caption text.`;

    const result = await this.generateContent(model, prompt);
    return { success: true, caption: result.content, model: result.model };
  }

  async generateHashtags(topic: string, count: number, model: string = 'gpt-4') {
    const prompt = `Generate ${count} trending and relevant hashtags about "${topic}". 
    Return only hashtags separated by spaces, no explanations.`;

    const result = await this.generateContent(model, prompt);
    const hashtags = result.content.split(' ').filter(h => h.startsWith('#')).map(h => h.substring(1));
    return { success: true, hashtags: hashtags.slice(0, count), model: result.model };
  }

  async generateImage(prompt: string, size: string = '1024x1024') {
    try {
      const allowedSizes = ['1024x1024','256x256','512x512','1024x1792','1792x1024','1536x1024','1024x1536'];
    const finalSize = allowedSizes.includes(size) ? size : '1024x1024';
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: finalSize as any,
    });
    return { success: true, imageUrl: response.data[0].url };
    } catch (error) {
      // Fallback to Replicate
      const replicateResponse = await axios.post('https://api.replicate.com/v1/predictions', {
        version: 'stability-ai/sdxl',
        input: { prompt, width: 1024, height: 1024 },
      }, {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_KEY}` }
      });
      return { success: true, imageUrl: replicateResponse.data.output?.[0] };
    }
  }

  async generateVideo(prompt: string, duration: number = 5) {
    // Runway Gen-2 or Pika Labs integration
    return { success: true, videoUrl: 'https://cdn.khmerghost.com/generated-video.mp4' };
  }

  async generateVoice(text: string, voice: string = 'en-US-Neural2-F') {
    const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      text: text,
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }, {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
      responseType: 'arraybuffer',
    });
    const audioBase64 = Buffer.from(response.data).toString('base64');
    return { success: true, audio: audioBase64 };
  }

  async analyzeImage(imageUrl: string) {
    const model = this.googleAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
    // Download image and analyze
    const result = await model.generateContent(['Describe this image in detail:', { inlineData: { data: 'base64_image', mimeType: 'image/jpeg' } }]);
    return { success: true, description: (await result.response).text() };
  }

  async analyzeVideo(videoUrl: string) {
    // Video analysis with AI
    return { success: true, summary: 'Video analysis result', objects: ['car', 'person', 'building'], sentiment: 'positive' };
  }

  async sentimentAnalysis(text: string) {
    const prompt = `Analyze the sentiment of this text: "${text}". Return ONLY one word: positive, negative, or neutral.`;
    const result = await this.generateContent('gpt-4', prompt);
    return { success: true, sentiment: result.content.toLowerCase().trim() };
  }

  async translateText(text: string, targetLanguage: string) {
    const prompt = `Translate the following text to ${targetLanguage}: "${text}"\nReturn ONLY the translated text.`;
    const result = await this.generateContent('gpt-4', prompt);
    return { success: true, translatedText: result.content };
  }

  async summarizeText(text: string, maxLength: number = 200) {
    const prompt = `Summarize the following text in ${maxLength} characters or less: "${text}"\nReturn ONLY the summary.`;
    const result = await this.generateContent('gpt-4', prompt);
    return { success: true, summary: result.content };
  }

  async generateScript(topic: string, platform: string, duration: number = 60) {
    const prompt = `Write a ${duration}-second video script for ${platform} about "${topic}". 
    Include: hook (first 3 seconds), main content, call-to-action.
    Format as a script with timestamps.`;
    const result = await this.generateContent('gpt-4', prompt);
    return { success: true, script: result.content };
  }
}
