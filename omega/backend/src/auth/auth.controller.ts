import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; fullName: string; tenantSubdomain: string }, @Req() req) {
    return this.authService.register(body.email, body.password, body.fullName, body.tenantSubdomain);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string; tenantSubdomain: string }, @Req() req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return this.authService.login(body.email, body.password, body.tenantSubdomain, ip);
  }

  @Post('refresh')
  async refresh(@Body() body: { token: string }) {
    return this.authService.refreshToken(body.token);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() body: { oldPassword: string; newPassword: string }, @Req() req) {
    return this.authService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enableTwoFactor(@Req() req) {
    return this.authService.enableTwoFactor(req.user.userId);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactor(@Req() req, @Body() body: { code: string }) {
    return this.authService.verifyTwoFactor(req.user.userId, body.code);
  }
}
