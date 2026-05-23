import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/entities/User.entity';
import { Tenant } from '../../src/entities/Tenant.entity';
import { Log } from '../../src/entities/Log.entity';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepository;
  let mockTenantRepository;
  let mockJwtService;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    mockTenantRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Tenant), useValue: mockTenantRepository },
        { provide: getRepositoryToken(Log), useValue: {} },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@test.com';
      const password = 'Test123!';
      const fullName = 'Test User';
      const tenantSubdomain = 'test';

      mockTenantRepository.findOne.mockResolvedValue(null);
      mockTenantRepository.save.mockResolvedValue({ id: 'tenant-id' });
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue({ id: 'user-id', email, fullName, subscriptionTier: 'free' });

      const result = await service.register(email, password, fullName, tenantSubdomain);

      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', email);
    });

    it('should throw error if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register('test@test.com', 'pass', 'name', 'tenant')).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@test.com';
      const password = 'Test123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      mockTenantRepository.findOne.mockResolvedValue({ id: 'tenant-id' });
      mockUserRepository.findOne.mockResolvedValue({
        id: 'user-id',
        email,
        passwordHash: hashedPassword,
        fullName: 'Test User',
        subscriptionTier: 'free',
      });

      const result = await service.login(email, password, 'tenant', '127.0.0.1');

      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', email);
    });

    it('should throw error with invalid credentials', async () => {
      mockTenantRepository.findOne.mockResolvedValue({ id: 'tenant-id' });
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login('wrong@test.com', 'pass', 'tenant', '127.0.0.1')).rejects.toThrow('Invalid credentials');
    });
  });
});
