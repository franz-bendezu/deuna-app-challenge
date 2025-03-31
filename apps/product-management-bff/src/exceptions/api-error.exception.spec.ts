import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error.exception';
import { AxiosError, AxiosHeaders } from 'axios';

describe('ApiError', () => {
  const fallbackMessage = 'Fallback error message';
  const fallbackStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  it('should handle AxiosError with response data containing message', () => {
    const axiosError = new AxiosError(
      'Axios error',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: { message: 'Axios error message' },
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Bad Request',
        headers: {},
        config: { headers: new AxiosHeaders({}) },
      },
    );

    const apiError = new ApiError(axiosError, fallbackMessage, fallbackStatus);

    expect(apiError.getResponse()).toEqual({
      message: 'Axios error message',
      statusCode: HttpStatus.BAD_REQUEST,
    });
    expect(apiError.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should handle AxiosError with response data not containing message', () => {
    const axiosError = new AxiosError(
      'Axios error',
      'ERR_NOT_FOUND',
      undefined,
      undefined,
      {
        data: 'Raw response data',
        status: HttpStatus.NOT_FOUND,
        statusText: 'Not Found',
        headers: {},
        config: { headers: new AxiosHeaders({}) },
      },
    );

    const apiError = new ApiError(axiosError, fallbackMessage, fallbackStatus);

    expect(apiError.getResponse()).toEqual({
      message: 'Raw response data',
      statusCode: HttpStatus.NOT_FOUND,
    });
    expect(apiError.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });

  it('should handle AxiosError without response', () => {
    const axiosError = new AxiosError(
      'Network Error',
      'ERR_NETWORK',
      undefined,
      undefined,
      undefined,
    );

    const apiError = new ApiError(axiosError, fallbackMessage, fallbackStatus);

    expect(apiError.getResponse()).toEqual({
      message: fallbackMessage,
      statusCode: fallbackStatus,
    });
    expect(apiError.getStatus()).toBe(fallbackStatus);
  });

  it('should handle generic Error', () => {
    const error = new Error('Generic error message');

    const apiError = new ApiError(error, fallbackMessage, fallbackStatus);

    expect(apiError.getResponse()).toEqual({
      message: 'Generic error message',
    });
    expect(apiError.getStatus()).toBe(fallbackStatus);
  });

  it('should handle unknown error type', () => {
    const error = 'Unknown error';

    const apiError = new ApiError(error, fallbackMessage, fallbackStatus);

    expect(apiError.getResponse()).toEqual({
      message: fallbackMessage,
    });
    expect(apiError.getStatus()).toBe(fallbackStatus);
  });
});
