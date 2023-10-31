import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateProfileDto } from 'src/auth/dto/update-profile.dto';
import { Tokens } from 'src/auth/types';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@GetCurrentUser() user: User) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(
    @Body() profile: UpdateProfileDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.authService.updateProfile(userId, profile);
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

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Query('refreshToken') refreshToken: string): Promise<Tokens> {
    console.log('refreshToken', refreshToken);
    return this.authService.getTokenFromRefreshToken(refreshToken);
  }
}
