import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import MessageConstants from 'src/common/constants/message.constants';
import * as jwt from 'jsonwebtoken';

export const GetCurrentUserId = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) return null;
    try {
      const token = authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return decodedToken?.sub;
    } catch (error) {
      throw new UnauthorizedException(MessageConstants.VERIFY_TOKEN_INVALID);
    }
  },
);
