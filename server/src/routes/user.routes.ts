/**
 * User Routes
 * Defines HTTP routes for user operations
 */

import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import {
  validateBody,
  validateQuery,
  validateParams,
  updateProfileSchema,
  updatePreferencesSchema,
  idParamSchema,
  paginationSchema
} from '../middleware/validator';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  apiLimiter,
  asyncHandler(userController.getProfile)
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile',
  apiLimiter,
  validateBody(updateProfileSchema),
  asyncHandler(userController.updateProfile)
);

/**
 * @route   GET /api/users/preferences
 * @desc    Get current user preferences
 * @access  Private
 */
router.get(
  '/preferences',
  apiLimiter,
  asyncHandler(userController.getPreferences)
);

/**
 * @route   PUT /api/users/preferences
 * @desc    Update current user preferences
 * @access  Private
 */
router.put(
  '/preferences',
  apiLimiter,
  validateBody(updatePreferencesSchema),
  asyncHandler(userController.updatePreferences)
);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete current user account
 * @access  Private
 */
router.delete(
  '/account',
  apiLimiter,
  asyncHandler(userController.deleteAccount)
);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get(
  '/',
  requireAdmin,
  apiLimiter,
  validateQuery(paginationSchema.partial()),
  asyncHandler(userController.getAllUsers)
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  requireAdmin,
  apiLimiter,
  validateParams(idParamSchema),
  asyncHandler(userController.getUserById)
);

export default router;
