import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import MessageConstants from 'src/common/constants/message.constants';
import { UserStatus } from 'src/common/constants/user.constants';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
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
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (token) {
      // try {
      let tokenDecoed = null;
      try {
        tokenDecoed = jwt.verify(token, process.env.AT_SECRET);
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new UnauthorizedException(
            MessageConstants.VERIFY_TOKEN_EXPIRED,
          );
        } else {
          throw new UnauthorizedException(
            MessageConstants.VERIFY_TOKEN_INVALID,
          );
        }
      }
      // Xác thực token
      // Kiểm tra thông tin người dùng, ví dụ kiểm tra role
      // return true nếu xác thực thành công và người dùng hợp lệ
      // return false nếu xác thực không thành công hoặc người dùng không hợp lệ
      const user = await this.userRepository.findById(tokenDecoed.sub);

      if (!user) {
        throw new UnauthorizedException(MessageConstants.VERIFY_TOKEN_EXPIRED);
      }
      if (user.status == UserStatus.DEACTIVATED) {
        throw new UnauthorizedException(
          MessageConstants.USER_HAS_BEEN_DEACTIVATED,
        );
      }

      // Validate role
      if (roles.length > 0 && !roles.includes(user.role)) {
        throw new ForbiddenException(MessageConstants.FORBIDDEN_NOT_AUTHORIZED);
      }
      // Add user to request
      request.user = user;
      // Add token decoded to request
      request.tokenDecoed = tokenDecoed;
      return true;
    } else {
      throw new UnauthorizedException(MessageConstants.VERIFY_TOKEN_INVALID);
    }
  }
}
