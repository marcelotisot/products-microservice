import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter, 
  HttpStatus 
} from '@nestjs/common';

import { Prisma } from '@prisma/client'; 
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = exception.message;

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT;
        message = `Unique constraint failed: ${exception.meta?.target}`;
        break;
      // Puedes manejar otros códigos aquí si lo necesitas
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}
