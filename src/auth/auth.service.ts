import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO } from './Dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { RefreshTokenResponse } from './auth.controller';
import { Enable2FAType } from './types/auth-types';
import { UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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
    private readonly configService: ConfigService,
  ) {}

  getEnvVariables() {
    return this.configService.get<number>('port');
  }

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

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Invalid user');
    if (user?.enable2FA) {
      return { secret: user.twoFASecret! };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret, 'SECRET');
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user?.id, user?.twoFASecret);
    return { secret: user?.twoFASecret };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      // find the user on the based on id
      const user = await this.userService.findById(userId);
      if (!user?.twoFASecret) {
        throw new UnauthorizedException('2FA not enabled for this user');
      }
      // extract his 2FA secret
      // verify the secret with a token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });
      // if validated then sends the json web token in the response
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch {
      throw new UnauthorizedException('Error verifying token');
    }
  }
}
