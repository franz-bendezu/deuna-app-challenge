import { HttpException, HttpStatus } from '@nestjs/common';
import { isAxiosError } from 'axios';

export class ApiError extends HttpException {
  constructor(
    error: unknown,
    fallbackMessage: string,
    fallbackStatus: HttpStatus,
  ) {
    if (
      isAxiosError<{
        message: string;
      }>(error)
    ) {
      const { response } = error;

      const message = response?.data?.message || fallbackMessage;
      const statusCode = response?.status || fallbackStatus;
      super({ message, statusCode }, statusCode);
    } else if (error instanceof Error) {
      super({ message: error.message || fallbackMessage }, fallbackStatus);
    } else {
      super({ message: fallbackMessage }, fallbackStatus);
    }
  }
}
