import { HttpException, HttpStatus } from '@nestjs/common';
import { isAxiosError } from 'axios';

export class ApiError extends HttpException {
  constructor(
    error: unknown,
    fallbackMessage: string,
    fallbackStatus: HttpStatus,
  ) {
    if (isAxiosError(error)) {
      const status = error.response?.status || fallbackStatus;
      let message = fallbackMessage;
      if (
        error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) {
        message = error.response.data.message;
      } else {
        message = fallbackMessage;
      }
      super(message, status);
    } else if (error instanceof Error) {
      super(error.message || fallbackMessage, fallbackStatus);
    } else {
      super(fallbackMessage, fallbackStatus);
    }
  }

  static notFound(error: unknown, resource: string = 'Resource'): ApiError {
    return new ApiError(error, `${resource} not found`, HttpStatus.NOT_FOUND);
  }

  static badRequest(
    error: unknown,
    action: string = 'process request',
  ): ApiError {
    return new ApiError(error, `Failed to ${action}`, HttpStatus.BAD_REQUEST);
  }

  static internal(
    error: unknown,
    action: string = 'process request',
  ): ApiError {
    return new ApiError(
      error,
      `Failed to ${action}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
