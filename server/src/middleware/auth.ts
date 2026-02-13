/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractBearerToken, JWTPayload } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import logger from '../config/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Required authentication middleware
 * Fails if no valid token is provided
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    // Verify token
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = payload;

    logger.debug('User authenticated', {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      logger.error('Authentication error', { error });
      next(new AuthenticationError('Authentication failed'));
    }
  }
}

/**
 * Optional authentication middleware
 * Attaches user if valid token is provided, but doesn't fail if not
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (token) {
      // Verify token if provided
      const payload = verifyAccessToken(token);
      req.user = payload;

      logger.debug('User authenticated (optional)', {
        userId: payload.userId,
        email: payload.email
      });
    }

    // Continue regardless of token presence or validity
    next();
  } catch (error) {
    // Log error but continue without authentication
    logger.debug('Optional auth failed, continuing without user', { error });
    next();
  }
}

/**
 * Role-based authorization middleware
 * Requires specific role(s) to access route
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Access denied - insufficient role', {
          userId: req.user.userId,
          userRole: req.user.role,
          requiredRoles: allowedRoles
        });
        throw new AuthenticationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Admin-only middleware
 * Shortcut for requireRole('admin')
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireRole('admin')(req, res, next);
}

/**
 * Self or admin middleware
 * Allows access if user is accessing their own resource or is an admin
 */
export function requireSelfOrAdmin(userIdParam: string = 'userId') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const targetUserId = req.params[userIdParam] || req.body[userIdParam];

      // Allow if user is admin or accessing their own resource
      if (req.user.role === 'admin' || req.user.userId === targetUserId) {
        next();
      } else {
        logger.warn('Access denied - not self or admin', {
          userId: req.user.userId,
          targetUserId,
          userRole: req.user.role
        });
        throw new AuthenticationError('Access denied');
      }
    } catch (error) {
      next(error);
    }
  };
}
