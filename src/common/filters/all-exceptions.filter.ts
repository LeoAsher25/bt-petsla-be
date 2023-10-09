import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('exeption: ', exception, exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception?.response?.status || exception?.status || 500;
    const message =
      exception?.response?.data?.error ||
      exception?.data?.error ||
      exception?.response?.message ||
      exception?.message ||
      'Something went wrong';
    const error =
      (statusCode === 401 && (exception?.response?.error || 'Unauthorized')) ||
      exception?.statusText ||
      exception?.response?.statusText ||
      'Internal Server Error';
    const body = {
      statusCode,
      message,
      errorCode: exception?.response?.code || undefined,
      data: exception?.response?.data || undefined, // Response for Fe to handle
      error,
    };

    if (statusCode === 500) {
      Logger.error(exception?.message, 'AllExceptionFilter');
    }
    response.status(statusCode).json(body);
  }
}
