import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, MagicLinkDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Post('magic-link')
  async sendMagicLink(@Body() magicLinkDto: MagicLinkDto) {
    // TODO: Implement magic link functionality
    return { message: 'Magic link sent to email' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Post('refresh')
  async refreshToken(@Body() body: { token: string }) {
    // TODO: Implement token refresh
    return { token: body.token };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }
}