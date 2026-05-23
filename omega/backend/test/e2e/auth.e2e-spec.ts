import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test_${Date.now()}@test.com`,
          password: 'Test123!',
          fullName: 'Test User',
          tenantSubdomain: 'test',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body.user).toHaveProperty('email');
        });
    });

    it('should return 400 for duplicate email', async () => {
      const email = `duplicate_${Date.now()}@test.com`;
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: 'Test123!', fullName: 'Test', tenantSubdomain: 'test' });
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: 'Test123!', fullName: 'Test', tenantSubdomain: 'test' })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const email = `login_${Date.now()}@test.com`;
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email, password: 'Test123!', fullName: 'Test', tenantSubdomain: 'test' });
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password: 'Test123!', tenantSubdomain: 'test' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@test.com', password: 'wrong', tenantSubdomain: 'test' })
        .expect(401);
    });
  });
});
