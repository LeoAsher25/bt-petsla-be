import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Tokens } from 'src/auth/types';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
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
    @Body() profile: UpdateUserDto,
    @GetCurrentUserId() userId: string,
  ) {
    try {
      await this.authService.updateProfile(userId, profile);

      return {
        message: 'Cập nhật thông tin cá nhân thành công',
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      await this.authService.logout(userId);
      return {
        success: true,
        message: 'Logout successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Body() body: any): Promise<Tokens> {
    try {
      return this.authService.getTokenFromRefreshToken(body.refreshToken);
    } catch (error) {
      throw error;
    }
  }
}
