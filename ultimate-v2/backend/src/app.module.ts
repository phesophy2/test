import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { SocialModule } from './social/social.module';
import { AiModule } from './ai/ai.module';
import { PaymentModule } from './payment/payment.module';
import { ApiKeysModule } from './api-keys/api-keys.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'khmerghost_ultimate',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    TenantModule,
    SocialModule,
    AiModule,
    PaymentModule,
    ApiKeysModule,
  ],
})
export class AppModule {}
