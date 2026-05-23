import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('security')
@UseGuards(JwtAuthGuard)
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @Post('encrypt')
  async encrypt(@Body() body: { text: string }) {
    return { encrypted: this.securityService.encrypt(body.text) };
  }

  @Post('decrypt')
  async decrypt(@Body() body: { text: string }) {
    return { decrypted: this.securityService.decrypt(body.text) };
  }

  @Post('validate-password')
  async validatePassword(@Body() body: { password: string }) {
    return this.securityService.validatePassword(body.password);
  }

  @Post('generate-api-key')
  async generateApiKey() {
    return { apiKey: this.securityService.generateApiKey() };
  }

  @Post('generate-csrf')
  async generateCsrfToken() {
    return { token: this.securityService.generateCsrfToken() };
  }
}
