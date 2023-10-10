import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception?.response?.status || exception?.status || 500;
    const message =
      exception?.response?.message || //  ex: mongoose error
      exception?.message || // ex: syntax error
      'Something went wrong';
    const error =
      (statusCode === 401 && (exception?.response?.error || 'Unauthorized')) ||
      exception?.name ||
      'Internal Server Error';
    const body = {
      statusCode,
      message,
      errorCode: exception?.response?.code || undefined,
      data: exception?.response?.data || undefined, // Response for Fe to handle
      error,
    };

    response.status(statusCode).json(body);
  }
}
