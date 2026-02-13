/**
 * Authentication Routes
 * Defines HTTP routes for authentication operations
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import {
  validateBody,
  registerSchema,
  loginSchema,
  oauthSchema,
  refreshTokenSchema,
  forgotPasswordSchema
} from '../middleware/validator';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(authController.register)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(authController.login)
);

/**
 * @route   POST /api/auth/oauth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.post(
  '/oauth/google',
  authLimiter,
  validateBody(oauthSchema),
  asyncHandler(authController.oauthGoogle)
);

/**
 * @route   POST /api/auth/oauth/facebook
 * @desc    Facebook OAuth login
 * @access  Public
 */
router.post(
  '/oauth/facebook',
  authLimiter,
  validateBody(oauthSchema),
  asyncHandler(authController.oauthFacebook)
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh-token',
  validateBody(refreshTokenSchema),
  asyncHandler(authController.refreshToken)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post(
  '/logout',
  validateBody(refreshTokenSchema),
  asyncHandler(authController.logout)
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get(
  '/me',
  requireAuth,
  asyncHandler(authController.getCurrentUser)
);

export default router;
