import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Tokens } from 'src/auth/types';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    await this.authService.logout(userId);
    return {
      success: true,
      message: 'Logout successfully',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Headers('refresh-token') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.getTokenFromRefreshToken(refreshToken);
  }
}
