import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/Dtos/create-user.dto';
import { LoginDTO } from './Dtos/login.dto';
import { AuthService } from './auth.service';
import { Enable2FAType } from './types/auth-types';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDTO } from './types/validate-token.dto';

interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDTO) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto): RefreshTokenResponse {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable-2fa')
  enable2FA(@Req() req: any): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('disable-2fa')
  disable2FA(@Req() req): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Req() req: any,
    @Body() validateTokenDto: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDto.token,
    );
  }
}
