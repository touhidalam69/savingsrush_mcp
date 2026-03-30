export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  cached: boolean;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const formatError = (message: string, error?: unknown): ErrorResponse => {
  return {
    success: false,
    message,
    error: error ? getErrorMessage(error) : undefined,
  };
};

export const formatSuccess = <T>(data: T, cached = false): SuccessResponse<T> => {
  return {
    success: true,
    data,
    cached,
  };
};

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
