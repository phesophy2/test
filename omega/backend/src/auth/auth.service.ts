import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/User.entity';
import { Tenant } from '../entities/Tenant.entity';
import { Log } from '../entities/Log.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string, tenantSubdomain: string) {
    let tenant = await this.tenantRepository.findOne({ where: { subdomain: tenantSubdomain } });
    if (!tenant) {
      tenant = await this.tenantRepository.save({
        name: `${fullName}'s Workspace`,
        subdomain: tenantSubdomain,
        branding: { companyName: fullName, primaryColor: '#00d4ff' },
        limits: { maxUsers: 10, maxAccounts: 50, maxPostsPerDay: 500, maxStorage: 10 },
      });
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userRepository.save({
      tenantId: tenant.id,
      email,
      passwordHash,
      fullName,
      subscriptionTier: 'starter',
      permissions: ['read', 'write'],
    });

    await this.logRepository.save({
      tenantId: tenant.id,
      userId: user.id,
      type: 'auth',
      action: 'user_registered',
      details: { email, ip: 'system' },
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email, tenantId: tenant.id });
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName, tier: user.subscriptionTier } };
  }

  async login(email: string, password: string, tenantSubdomain: string, ip: string) {
    const tenant = await this.tenantRepository.findOne({ where: { subdomain: tenantSubdomain } });
    if (!tenant) throw new UnauthorizedException('Invalid tenant');

    const user = await this.userRepository.findOne({ where: { email, tenantId: tenant.id } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.userRepository.update(user.id, { lastLoginAt: new Date(), lastLoginIp: ip });

    await this.logRepository.save({
      tenantId: tenant.id,
      userId: user.id,
      type: 'auth',
      action: 'user_logged_in',
      details: { email, ip },
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email, tenantId: tenant.id });
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName, tier: user.subscriptionTier } };
  }

  async refreshToken(oldToken: string) {
    try {
      const decoded = this.jwtService.verify(oldToken);
      const newToken = this.jwtService.sign({ userId: decoded.userId, email: decoded.email, tenantId: decoded.tenantId });
      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const newHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(userId, { passwordHash: newHash });

    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { success: true }; // Don't reveal if user exists

    // Generate reset token and send email
    // Implementation would go here

    return { success: true, message: 'Reset link sent to email' };
  }

  async enableTwoFactor(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // Generate 2FA secret
    const secret = 'TOTP_SECRET_' + Math.random().toString(36).substring(2);
    await this.userRepository.update(userId, { isTwoFactorEnabled: true, twoFactorSecret: secret });

    return { secret, qrCodeUrl: `https://chart.googleapis.com/chart?cht=qr&chl=otpauth://totp/KhmerGhost:${user.email}?secret=${secret}&issuer=KhmerGhost&chs=200x200` };
  }

  async verifyTwoFactor(userId: string, code: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) throw new UnauthorizedException('2FA not enabled');

    // Verify TOTP code (simplified)
    // In production, use speakeasy or otplib
    const isValid = code === '123456'; // Placeholder

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    return { success: true };
  }
}
