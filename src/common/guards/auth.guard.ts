import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import MessageConstants from 'src/common/constants/message.constants';
import { UserStatus } from 'src/common/constants/user.constants';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    // Lấy danh sách các roles được phép truy cập route
    const roles: any =
      this.reflector.get<boolean>('roles', context.getHandler()) || [];
    if (isPublic) {
      // Nếu có decorator `@Public()` được sử dụng, cho phép truy cập
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.replace('Bearer ', '');

    if (accessToken) {
      let tokenDecode = null;
      try {
        tokenDecode = await this.jwtService.verify(accessToken, {
          secret: process.env.ACCESS_TOKEN_SECRET,
        });
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedException(
            MessageConstants.VERIFY_TOKEN_EXPIRED,
          );
        } else {
          throw new UnauthorizedException();
        }
      }

      // Xác thực token
      // Kiểm tra thông tin người dùng, ví dụ kiểm tra role
      // return true nếu xác thực thành công và người dùng hợp lệ
      // return false nếu xác thực không thành công hoặc người dùng không hợp lệ
      const user = await this.userRepository.findById(tokenDecode.sub);

      if (!user) {
        throw new UnauthorizedException(MessageConstants.VERIFY_TOKEN_EXPIRED);
      }
      if (user.status == UserStatus.BLOCKED) {
        throw new UnauthorizedException(MessageConstants.USER_HAS_BEEN_BLOCKED);
      }

      // Validate role
      if (roles.length > 0 && !roles.includes(user.role)) {
        throw new ForbiddenException(MessageConstants.FORBIDDEN_NOT_AUTHORIZED);
      }
      // Add user to request
      request.user = user;
      // Add token decoded to request
      request.tokenDecode = tokenDecode;
      return true;
    } else {
      throw new UnauthorizedException(MessageConstants.VERIFY_TOKEN_INVALID);
    }
  }
}
