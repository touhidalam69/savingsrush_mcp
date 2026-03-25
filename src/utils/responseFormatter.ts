export const formatError = (message: string, error?: any) => {
  return {
    success: false,
    message,
    error: error?.message || error
  };
};

export const formatSuccess = (data: any, cached: boolean = false) => {
  return {
    success: true,
    data,
    cached
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
