import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/User.entity';
import { Tenant } from '../entities/Tenant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string, tenantSubdomain: string) {
    let tenant = await this.tenantRepository.findOne({ where: { subdomain: tenantSubdomain } });
    if (!tenant) {
      tenant = await this.tenantRepository.save({
        name: `${fullName}'s Workspace`,
        subdomain: tenantSubdomain,
        branding: { companyName: fullName, primaryColor: '#00d4ff' }
      });
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.save({
      email,
      passwordHash,
      fullName,
      subscriptionTier: 'free'
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email, tenantId: tenant.id });
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName, tier: user.subscriptionTier } };
  }

  async login(email: string, password: string, tenantSubdomain: string) {
    const tenant = await this.tenantRepository.findOne({ where: { subdomain: tenantSubdomain } });
    if (!tenant) throw new UnauthorizedException('Invalid tenant');

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    const token = this.jwtService.sign({ userId: user.id, email: user.email, tenantId: tenant.id });
    return { token, user: { id: user.id, email: user.email, fullName: user.fullName, tier: user.subscriptionTier } };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
