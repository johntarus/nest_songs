import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO } from './Dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenResponse } from './auth.controller';

export interface JwtPayload {
  email: string;
  sub: string;
  [key: string]: any;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDTO) {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };

    // Generate Access Token (short-lived)
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'secretKey',
      expiresIn: '1h',
    });

    // Generate Refresh Token (long-lived)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      expiresIn: '7d',
    });

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    };
  }

  refreshToken(token: string): RefreshTokenResponse {
    try {
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      });

      const newAccessToken: string = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { secret: process.env.JWT_SECRET || 'secretKey', expiresIn: '1h' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
