import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as unidecode from 'unidecode';

export const UnidecodeQuery = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const transformedQuery = { ...request.query };
    data?.fields?.forEach((field: string) => {
      if (request.query[field] !== undefined) {
        if (request.query[field] === 'true' || request.query[field] === 'false')
          transformedQuery[field] =
            request.query[field] === 'true' ? true : false;
        else transformedQuery[field] = unidecode(request.query[field]);
      }
    });

    // Biến đổi dữ liệu gốc thành đối tượng DTO
    const queryDto = plainToClass(data.dto, transformedQuery);

    // Kiểm tra hợp lệ bằng class-validator
    const validationErrors = validateSync(queryDto);

    if (validationErrors.length > 0) {
      // Tạo một mảng chứa các thông điệp lỗi tùy chỉnh
      const customErrorMessages = validationErrors.map((error) => {
        // Đây là nơi bạn có thể tạo các thông điệp lỗi tùy chỉnh dựa trên error.constraints
        return Object.values(error.constraints).join('; ');
      });

      // Ném ra một lỗi ValidationError với thông điệp tùy chỉnh
      throw new BadRequestException(customErrorMessages);
    }

    return transformedQuery;
  },
);
