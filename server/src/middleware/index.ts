/**
 * Middleware Exports
 * Central export point for all middleware
 */

// Authentication middleware
export {
  requireAuth,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireSelfOrAdmin
} from './auth';

// Error handling middleware
export {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  setupProcessErrorHandlers
} from './errorHandler';

// Rate limiting middleware
export {
  generalLimiter,
  authLimiter,
  apiLimiter,
  passwordResetLimiter,
  uploadLimiter
} from './rateLimiter';

// Validation middleware
export {
  validateBody,
  validateQuery,
  validateParams,
  // Common schemas
  registerSchema,
  loginSchema,
  oauthSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updatePreferencesSchema,
  createProductSchema,
  updateProductSchema,
  createTransactionSchema,
  paginationSchema,
  searchSchema,
  idParamSchema,
  dateRangeSchema
} from './validator';

// Subscription middleware
export {
  requireTier,
  requireBasicTier,
  requireProTier,
  requireEnterpriseTier,
  requireFeature,
  getTierLimits,
  checkUsageLimit,
  attachTierInfo,
  SubscriptionTier,
  TIER_LIMITS
} from './subscription';
