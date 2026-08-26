export class AppError extends Error{
  readonly statusCode: number;
  // status: string;
  readonly isOperational: boolean;
  
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}