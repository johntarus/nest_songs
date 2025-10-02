import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/Dtos/create-user.dto';
import { LoginDTO } from './Dtos/login.dto';
import { AuthService } from './auth.service';

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
}
