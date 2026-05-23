import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import axios from 'axios';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateCaption(topic: string, tone: string = 'casual', platform: string = 'facebook') {
    const prompt = `Write a ${tone} social media caption for ${platform} about "${topic}". Keep it engaging and use emojis.`;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.8,
      });
      return { success: true, caption: response.choices[0].message.content };
    } catch (error) {
      return this.getFallbackCaption(topic);
    }
  }

  async generateHashtags(topic: string, count: number = 10) {
    const prompt = `Generate ${count} trending hashtags about "${topic}" for social media. Return only hashtags separated by commas.`;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
      });
      const hashtags = response.choices[0].message.content.split(',').map(h => h.trim());
      return { success: true, hashtags };
    } catch (error) {
      return { success: true, hashtags: [`#${topic.replace(/\s/g, '')}`, '#viral', '#trending', '#fyp', '#explore'] };
    }
  }

  async generateComment(postContent: string) {
    const prompt = `Write a genuine, engaging comment responding to this post: "${postContent.substring(0, 100)}..."`;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 80,
      });
      return { success: true, comment: response.choices[0].message.content };
    } catch (error) {
      const templates = ['This is amazing! 🔥', 'Love this content! ❤️', 'So true! 💯', 'Great post! 🚀'];
      return { success: true, comment: templates[Math.floor(Math.random() * templates.length)] };
    }
  }

  async generateImage(prompt: string) {
    try {
      const response = await axios.post('https://api.replicate.com/v1/predictions', {
        version: 'stability-ai/sdxl',
        input: { prompt, width: 1024, height: 1024 },
      }, {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_KEY}` }
      });
      return { success: true, imageUrl: response.data.output?.[0] };
    } catch (error) {
      return { success: false, error: 'Image generation failed' };
    }
  }

  async analyzeSentiment(text: string) {
    const prompt = `Analyze the sentiment of this text: "${text}". Return only: positive, negative, or neutral.`;
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 10,
      });
      return { success: true, sentiment: response.choices[0].message.content.toLowerCase() };
    } catch (error) {
      return { success: true, sentiment: 'neutral' };
    }
  }

  private getFallbackCaption(topic: string): any {
    const templates = [
      `Check out this amazing ${topic}! 🔥 What do you think?`,
      `So excited to share this ${topic} with you all! ✨`,
      `${topic} vibes only! 🚀 Who's with me?`,
      `New ${topic} just dropped! Tag a friend who needs to see this! 🎉`
    ];
    return { success: true, caption: templates[Math.floor(Math.random() * templates.length)] };
  }
}
