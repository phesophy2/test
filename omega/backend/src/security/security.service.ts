import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
  private readonly IV_LENGTH = 16;

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  generateApiKey(): string {
    return `khg_${crypto.randomBytes(32).toString('hex')}`;
  }

  generateSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = local.slice(0, 2) + '***' + local.slice(-2);
    return `${maskedLocal}@${domain}`;
  }

  maskPhone(phone: string): string {
    return phone.slice(0, 3) + '****' + phone.slice(-3);
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain at least one special character (!@#$%^&*)');
    return { valid: errors.length === 0, errors };
  }

  rateLimitCheck(ip: string, action: string, limit: number = 100, windowMs: number = 60000): boolean {
    // Simple stub; replace with Redis in production
    return true;
  }

  sanitizeInput(input: string): string {
    return input.replace(/[<>]/g, '').trim();
  }

  generateCsrfToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  verifyWebhookSignature(payload: any, signature: string, secret: string): boolean {
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    return signature === expected;
  }
}
