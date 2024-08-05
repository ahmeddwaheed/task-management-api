import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';


interface ErrorResponse {
  status: number;
  message: string;
}

class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let error: ErrorResponse = { status: 500, message: 'Something went wrong' };

  if (err instanceof AppError) {
    error = { status: err.status, message: err.message };
  } else if (err instanceof MongooseError.ValidationError || err instanceof ValidationError) {
    error = { status: 400, message: 'Validation Error: ' + err.message };
  } else if (err instanceof MongooseError.CastError) {
    error = { status: 400, message: 'Invalid ID: ' + err.message };
  } else if (err instanceof JsonWebTokenError) {
    error = { status: 401, message: 'Invalid token: ' + err.message };
  } else if (err instanceof TokenExpiredError) {
    error = { status: 401, message: 'Token expired' };
  }
  console.error(err);
  res.status(error.status).json(error);
};


export { errorHandler, AppError, ValidationError };
