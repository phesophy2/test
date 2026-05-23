import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; fullName: string; tenantSubdomain: string }) {
    return this.authService.register(body.email, body.password, body.fullName, body.tenantSubdomain);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string; tenantSubdomain: string }) {
    return this.authService.login(body.email, body.password, body.tenantSubdomain);
  }
}
