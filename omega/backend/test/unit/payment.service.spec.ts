import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../src/payment/payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../../src/entities/Payment.entity';
import { Subscription } from '../../src/entities/Subscription.entity';
import { User } from '../../src/entities/User.entity';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getRepositoryToken(Payment), useValue: { save: jest.fn(), update: jest.fn() } },
        { provide: getRepositoryToken(Subscription), useValue: { save: jest.fn(), update: jest.fn() } },
        { provide: getRepositoryToken(User), useValue: { update: jest.fn() } },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  describe('getPaymentMethods', () => {
    it('should return all payment methods', () => {
      const methods = service.getPaymentMethods();
      expect(methods).toHaveProperty('cambodia');
      expect(methods).toHaveProperty('asia');
      expect(methods).toHaveProperty('global');
      expect(methods).toHaveProperty('crypto');
      expect(methods.cambodia).toContain('Wing');
      expect(methods.cambodia).toContain('ABA');
    });
  });

  describe('createCryptoPayment', () => {
    it('should return crypto payment details', async () => {
      const result = await service.createCryptoPayment(100, 'USDT', 'BEP-20');
      expect(result).toHaveProperty('walletAddress');
      expect(result).toHaveProperty('amount', 100);
      expect(result).toHaveProperty('currency', 'USDT');
    });
  });
});
