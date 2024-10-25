import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
  ) {
    return req.user;
  }

  @Post('signup')
  async signUp(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    await this.authService.signUp(name, email, password);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refreshToken(@Req() req) {
    return this.authService.getTokenFromRefToken(req.user.userId);
  }

  @Post('signout')
  @UseGuards(AuthGuard('jwt'))
  signOut(@Req() req) {
    this.authService.signOut(req.user.userId);
  }
}
