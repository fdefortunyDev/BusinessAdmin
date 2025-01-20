import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception, host);
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      const responseBody = {
        statusCode: httpStatus,
        message: exception.message,
        error: exception.name ?? exception,
      };
      response.status(httpStatus).json(responseBody);
    }
  }
}
