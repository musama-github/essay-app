import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await argon2.verify(user.hashedPassword, pass))) {
      return await this.login(user.id);
    } else {
      throw new UnauthorizedException();
    }
  }

  async login(userId: number) {
    const { token, refreshToken } = this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
    return {
      userId,
      token,
      refreshToken,
    };
  }

  generateTokens(userId: number) {
    const payload = { userId: userId };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      payload,
      this.configService.get('jwtRefresh'),
    );
    return {
      token,
      refreshToken,
    };
  }

  async getTokenFromRefToken(userId: number) {
    const { token, refreshToken } = this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateHashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
    return {
      userId,
      token,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    const refreshTokenMatched = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (user && refreshTokenMatched) {
      return { userId };
    } else {
      throw new UnauthorizedException('Invalid user or refresh token');
    }
  }

  async validateUserLoggedIn(userId: number) {
    const user = await this.usersService.findOneById(userId);
    if (user && user.hashedRefreshToken != null) {
      return { userId };
    } else {
      throw new UnauthorizedException();
    }
  }
  async signUp(name: string, email: string, password: string): Promise<any> {
    const user = await this.usersService.createUser(name, email, password);
    return user;
  }

  async signOut(userId: number) {
    await this.usersService.updateHashedRefreshToken(userId, null);
  }
}
