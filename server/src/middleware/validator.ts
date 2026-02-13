/**
 * Request Validation Middleware
 * Uses Zod for schema validation
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
import logger from '../config/logger';

/**
 * Validate request body against schema
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.debug('Body validation failed', {
          errors: error.errors,
          body: req.body
        });
        next(error);
      } else {
        next(new ValidationError('Invalid request body'));
      }
    }
  };
}

/**
 * Validate request query parameters against schema
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.debug('Query validation failed', {
          errors: error.errors,
          query: req.query
        });
        next(error);
      } else {
        next(new ValidationError('Invalid query parameters'));
      }
    }
  };
}

/**
 * Validate request URL parameters against schema
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.debug('Params validation failed', {
          errors: error.errors,
          params: req.params
        });
        next(error);
      } else {
        next(new ValidationError('Invalid URL parameters'));
      }
    }
  };
}

/**
 * Common validation schemas
 */

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['user', 'admin', 'msme', 'consumer']).optional().default('user'),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  phone: z.string().optional()
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// OAuth login schema
export const oauthSchema = z.object({
  provider: z.enum(['google', 'facebook']),
  accessToken: z.string().min(1, 'Access token is required'),
  profile: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    picture: z.string().optional()
  })
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100)
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  avatarUrl: z.string().url().optional()
});

// Update preferences schema
export const updatePreferencesSchema = z.object({
  language: z.enum(['en', 'hi']).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional()
});

// Product schema
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().default('pcs'),
  currentStock: z.number().int().min(0).default(0),
  minStockLevel: z.number().int().min(0).default(0),
  maxStockLevel: z.number().int().min(0).optional(),
  costPrice: z.number().min(0).default(0),
  sellingPrice: z.number().min(0).default(0),
  mrp: z.number().min(0).optional(),
  imageUrl: z.string().url().optional()
});

// Update product schema
export const updateProductSchema = createProductSchema.partial();

// Transaction schema
export const createTransactionSchema = z.object({
  type: z.enum(['sale', 'purchase', 'return', 'adjustment']),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1),
      unitPrice: z.number().min(0)
    })
  ).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'credit']).optional(),
  paymentStatus: z.enum(['pending', 'completed', 'failed']).default('pending'),
  notes: z.string().optional(),
  transactionDate: z.string().datetime().optional()
});

// Query pagination schema
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('20'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Search query schema
export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  minPrice: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().min(0)).optional()
}).merge(paginationSchema);

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format')
});

// Date range schema
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  'Start date must be before or equal to end date'
);
