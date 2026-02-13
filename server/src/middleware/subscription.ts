/**
 * Subscription Tier Middleware
 * Handles subscription-based access control
 */

import { Request, Response, NextFunction } from 'express';
import { AuthorizationError, AuthenticationError } from '../utils/errors';
import logger from '../config/logger';

/**
 * Subscription tier hierarchy
 */
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

/**
 * Tier hierarchy order (lower number = lower tier)
 */
const TIER_HIERARCHY: Record<string, number> = {
  [SubscriptionTier.FREE]: 0,
  [SubscriptionTier.BASIC]: 1,
  [SubscriptionTier.PRO]: 2,
  [SubscriptionTier.ENTERPRISE]: 3
};

/**
 * Feature limits by tier
 */
export const TIER_LIMITS = {
  [SubscriptionTier.FREE]: {
    maxProducts: 50,
    maxTransactionsPerMonth: 100,
    maxUsers: 1,
    aiFeatures: false,
    priceForecasting: false,
    advancedReports: false,
    apiAccess: false,
    support: 'community'
  },
  [SubscriptionTier.BASIC]: {
    maxProducts: 500,
    maxTransactionsPerMonth: 1000,
    maxUsers: 3,
    aiFeatures: true,
    priceForecasting: true,
    advancedReports: false,
    apiAccess: false,
    support: 'email'
  },
  [SubscriptionTier.PRO]: {
    maxProducts: 5000,
    maxTransactionsPerMonth: 10000,
    maxUsers: 10,
    aiFeatures: true,
    priceForecasting: true,
    advancedReports: true,
    apiAccess: true,
    support: 'priority'
  },
  [SubscriptionTier.ENTERPRISE]: {
    maxProducts: -1, // unlimited
    maxTransactionsPerMonth: -1, // unlimited
    maxUsers: -1, // unlimited
    aiFeatures: true,
    priceForecasting: true,
    advancedReports: true,
    apiAccess: true,
    support: 'dedicated'
  }
};

/**
 * Check if user's tier is sufficient
 */
function hasMinimumTier(userTier: string, requiredTier: SubscriptionTier): boolean {
  const userLevel = TIER_HIERARCHY[userTier] ?? -1;
  const requiredLevel = TIER_HIERARCHY[requiredTier] ?? 999;
  return userLevel >= requiredLevel;
}

/**
 * Get upgrade message for insufficient tier
 */
function getUpgradeMessage(currentTier: string, requiredTier: SubscriptionTier): string {
  const tierNames: Record<string, string> = {
    [SubscriptionTier.FREE]: 'Free',
    [SubscriptionTier.BASIC]: 'Basic',
    [SubscriptionTier.PRO]: 'Pro',
    [SubscriptionTier.ENTERPRISE]: 'Enterprise'
  };

  return `This feature requires ${tierNames[requiredTier]} plan or higher. You are currently on ${tierNames[currentTier] || 'Free'} plan. Please upgrade your subscription to access this feature.`;
}

/**
 * Require minimum subscription tier middleware
 */
export function requireTier(minTier: SubscriptionTier) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const userTier = req.user.subscriptionTier || SubscriptionTier.FREE;

      // Check if user has minimum tier
      if (!hasMinimumTier(userTier, minTier)) {
        logger.warn('Insufficient subscription tier', {
          userId: req.user.userId,
          userTier,
          requiredTier: minTier,
          path: req.path
        });

        throw new AuthorizationError(getUpgradeMessage(userTier, minTier));
      }

      // Attach tier limits to request for use in controllers
      (req as any).tierLimits = TIER_LIMITS[userTier as SubscriptionTier];

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Require basic tier or higher
 */
export function requireBasicTier(req: Request, res: Response, next: NextFunction): void {
  requireTier(SubscriptionTier.BASIC)(req, res, next);
}

/**
 * Require pro tier or higher
 */
export function requireProTier(req: Request, res: Response, next: NextFunction): void {
  requireTier(SubscriptionTier.PRO)(req, res, next);
}

/**
 * Require enterprise tier
 */
export function requireEnterpriseTier(req: Request, res: Response, next: NextFunction): void {
  requireTier(SubscriptionTier.ENTERPRISE)(req, res, next);
}

/**
 * Check feature access based on tier
 */
export function requireFeature(featureName: keyof typeof TIER_LIMITS.free) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      const userTier = req.user.subscriptionTier || SubscriptionTier.FREE;
      const tierLimits = TIER_LIMITS[userTier as SubscriptionTier];

      if (!tierLimits) {
        throw new AuthorizationError('Invalid subscription tier');
      }

      // Check if feature is enabled for user's tier
      const featureValue = tierLimits[featureName];

      if (featureValue === false) {
        logger.warn('Feature not available in subscription tier', {
          userId: req.user.userId,
          userTier,
          feature: featureName,
          path: req.path
        });

        throw new AuthorizationError(
          `This feature is not available in your current plan. Please upgrade to access ${featureName}.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Get user's tier limits
 */
export function getTierLimits(tier: SubscriptionTier | string): typeof TIER_LIMITS.free {
  return TIER_LIMITS[tier as SubscriptionTier] || TIER_LIMITS[SubscriptionTier.FREE];
}

/**
 * Check if user can perform action based on usage limits
 */
export async function checkUsageLimit(
  _userId: string,
  limitType: keyof typeof TIER_LIMITS.free,
  currentUsage: number
): Promise<boolean> {
  // This would typically fetch the user's tier from database
  // For now, we'll assume it's passed via the function or retrieved from context
  const tier = SubscriptionTier.FREE; // Replace with actual tier lookup
  const limits = getTierLimits(tier);
  const limit = limits[limitType];

  // -1 means unlimited
  if (limit === -1) {
    return true;
  }

  // For boolean features
  if (typeof limit === 'boolean') {
    return limit;
  }

  // For numeric limits
  if (typeof limit === 'number') {
    return currentUsage < limit;
  }

  return true;
}

/**
 * Attach tier information to request
 */
export function attachTierInfo(req: Request, _res: Response, next: NextFunction): void {
  if (req.user) {
    const userTier = req.user.subscriptionTier || SubscriptionTier.FREE;
    (req as any).tier = userTier;
    (req as any).tierLimits = getTierLimits(userTier);
  }
  next();
}
