import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { ApiKey } from '../entities/ApiKey.entity';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async generateApiKey(tenantId: string, userId: string, name: string, permissions: string[] = ['read']) {
    const apiKey = `khg_${randomBytes(32).toString('hex')}`;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const key = this.apiKeyRepository.create({
      tenantId,
      userId,
      apiKey,
      name,
      permissions,
      expiresAt,
    });

    await this.apiKeyRepository.save(key);
    return { apiKey, name, permissions, expiresAt };
  }

  async validateApiKey(apiKey: string): Promise<ApiKey | null> {
    const key = await this.apiKeyRepository.findOne({
      where: { apiKey, isActive: true }
    });
    
    if (!key) return null;
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return null;
    
    await this.apiKeyRepository.update(key.id, { lastUsedAt: new Date() });
    return key;
  }

  async revokeApiKey(id: string) {
    await this.apiKeyRepository.update(id, { isActive: false });
    return { success: true };
  }

  async getApiKeys(tenantId: string, userId: string) {
    return this.apiKeyRepository.find({ where: { tenantId, userId } });
  }
}
