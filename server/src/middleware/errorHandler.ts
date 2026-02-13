/**
 * Global Error Handler Middleware
 * Centralized error handling for the application
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import logger from '../config/logger';

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: any;
    stack?: string;
  };
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error
  logger.error('Error caught by error handler', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
    ip: req.ip
  });

  // Handle different error types
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  let details: any = undefined;

  // AppError and its subclasses
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.constructor.name.replace('Error', '').toUpperCase();
  }
  // Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));
  }
  // JWT errors
  else if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token has expired';
    code = 'TOKEN_EXPIRED';
  } else if (error instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid authentication token';
    code = 'INVALID_TOKEN';
  }
  // SQLite errors
  else if (error.message.includes('SQLITE_')) {
    statusCode = 500;
    code = 'DATABASE_ERROR';
    message = IS_DEV ? error.message : 'Database operation failed';

    // Handle specific SQLite errors
    if (error.message.includes('UNIQUE constraint failed')) {
      statusCode = 409;
      code = 'DUPLICATE_ENTRY';
      message = 'Resource already exists';

      // Extract field name from error message
      const match = error.message.match(/UNIQUE constraint failed: \w+\.(\w+)/);
      if (match) {
        details = { field: match[1] };
      }
    } else if (error.message.includes('FOREIGN KEY constraint failed')) {
      statusCode = 400;
      code = 'INVALID_REFERENCE';
      message = 'Invalid reference to related resource';
    } else if (error.message.includes('NOT NULL constraint failed')) {
      statusCode = 400;
      code = 'MISSING_REQUIRED_FIELD';
      const match = error.message.match(/NOT NULL constraint failed: \w+\.(\w+)/);
      if (match) {
        message = `Missing required field: ${match[1]}`;
        details = { field: match[1] };
      }
    }
  }
  // Multer file upload errors
  else if (error.message.includes('LIMIT_FILE_SIZE')) {
    statusCode = 413;
    message = 'File size too large';
    code = 'FILE_TOO_LARGE';
  } else if (error.message.includes('LIMIT_FILE_COUNT')) {
    statusCode = 400;
    message = 'Too many files uploaded';
    code = 'TOO_MANY_FILES';
  } else if (error.message.includes('LIMIT_UNEXPECTED_FILE')) {
    statusCode = 400;
    message = 'Unexpected file field';
    code = 'UNEXPECTED_FILE';
  }
  // Syntax errors (usually from JSON parsing)
  else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
    code = 'INVALID_JSON';
  }

  // Construct error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
      statusCode,
      ...(details && { details })
    }
  };

  // Include stack trace in development
  if (IS_DEV && error.stack) {
    errorResponse.error.stack = error.stack;
  }

  // Send response
  res.status(statusCode).json(errorResponse);
}

/**
 * Not Found handler (404)
 * Place this before the error handler
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const error = new AppError(`Route not found: ${req.method} ${req.path}`, 404);
  next(error);
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Handle uncaught exceptions and unhandled rejections
 */
export function setupProcessErrorHandlers(): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack
    });

    // Give time for logger to write before exiting
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('unhandledRejection', (reason: any, _promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack
    });

    // Give time for logger to write before exiting
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    // Graceful shutdown logic here
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    // Graceful shutdown logic here
    process.exit(0);
  });
}
