/**
 * Subscription Routes
 * Manages subscription plans and user subscriptions
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * GET /plans - List all subscription plans
 * @access Public
 */
router.get('/plans', async (_req: Request, res: Response) => {
  try {
    const db = getDb();

    const plans = db
      .prepare(
        `
        SELECT *
        FROM subscription_plans
        WHERE is_active = 1
        ORDER BY price_monthly ASC
        `
      )
      .all();

    // Parse features JSON for each plan
    const parsedPlans = plans.map((plan: any) => ({
      ...plan,
      features: JSON.parse(plan.features || '[]')
    }));

    res.json({
      success: true,
      plans: parsedPlans
    });
  } catch (error: any) {
    console.error('Error getting subscription plans:', error);
    res.status(500).json({ success: false, error: 'Failed to get subscription plans' });
  }
});

/**
 * GET /current - Get current user subscription
 * @access Private
 */
router.get('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    // Get user's current subscription tier from users table
    const user = db
      .prepare('SELECT subscription_tier, subscription_expires_at FROM users WHERE id = ?')
      .get(userId) as any;

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get active subscription details
    const subscription = db
      .prepare(
        `
        SELECT s.*, sp.name, sp.tier, sp.features
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        WHERE s.user_id = ? AND s.is_active = 1
        ORDER BY s.created_at DESC
        LIMIT 1
        `
      )
      .get(userId) as any;

    let subscriptionData = null;

    if (subscription) {
      subscriptionData = {
        ...subscription,
        features: JSON.parse(subscription.features || '[]'),
        isExpired: new Date(subscription.end_date) < new Date(),
        daysRemaining: Math.ceil(
          (new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      };
    }

    return res.json({
      success: true,
      currentTier: user.subscription_tier,
      expiresAt: user.subscription_expires_at,
      subscription: subscriptionData
    });
  } catch (error: any) {
    console.error('Error getting current subscription:', error);
    return res.status(500).json({ success: false, error: 'Failed to get current subscription' });
  }
});

/**
 * POST /subscribe - Subscribe to a plan
 * @access Private
 */
router.post('/subscribe', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { planId, billingCycle } = req.body;

    if (!planId || !billingCycle) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID and billing cycle are required'
      });
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        error: 'Billing cycle must be "monthly" or "yearly"'
      });
    }

    const db = getDb();

    // Get plan details
    const plan = db
      .prepare('SELECT * FROM subscription_plans WHERE id = ? AND is_active = 1')
      .get(planId) as any;

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    // Calculate amount and dates
    const amount = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
    const startDate = new Date().toISOString();
    const endDate = new Date();

    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscriptionId = randomUUID();

    // Deactivate any existing active subscriptions
    db.prepare('UPDATE subscriptions SET is_active = 0 WHERE user_id = ? AND is_active = 1')
      .run(userId);

    // Create new subscription
    db.prepare(
      `
      INSERT INTO subscriptions (
        id, user_id, plan_id, billing_cycle, amount, start_date,
        end_date, is_active, auto_renew, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
      `
    ).run(
      subscriptionId,
      userId,
      planId,
      billingCycle,
      amount,
      startDate,
      endDate.toISOString(),
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Update user's subscription tier
    db.prepare('UPDATE users SET subscription_tier = ?, subscription_expires_at = ? WHERE id = ?')
      .run(plan.tier, endDate.toISOString(), userId);

    return res.json({
      success: true,
      subscriptionId,
      message: 'Subscription created successfully',
      tier: plan.tier,
      expiresAt: endDate.toISOString()
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ success: false, error: 'Failed to create subscription' });
  }
});

/**
 * POST /cancel - Cancel subscription
 * @access Private
 */
router.post('/cancel', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const db = getDb();

    // Get active subscription
    const subscription = db
      .prepare('SELECT * FROM subscriptions WHERE user_id = ? AND is_active = 1')
      .get(userId) as any;

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'No active subscription found'
      });
    }

    // Disable auto-renewal (keep active until end date)
    db.prepare('UPDATE subscriptions SET auto_renew = 0, updated_at = ? WHERE id = ?')
      .run(new Date().toISOString(), subscription.id);

    return res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of billing period',
      endsAt: subscription.end_date
    });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ success: false, error: 'Failed to cancel subscription' });
  }
});

/**
 * POST /upgrade - Upgrade subscription plan
 * @access Private
 */
router.post('/upgrade', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        error: 'Plan ID is required'
      });
    }

    const db = getDb();

    // Get current subscription
    const currentSubscription = db
      .prepare(
        `
        SELECT s.*, sp.tier as current_tier
        FROM subscriptions s
        JOIN subscription_plans sp ON s.plan_id = sp.id
        WHERE s.user_id = ? AND s.is_active = 1
        `
      )
      .get(userId) as any;

    if (!currentSubscription) {
      return res.status(404).json({
        success: false,
        error: 'No active subscription found'
      });
    }

    // Get new plan
    const newPlan = db
      .prepare('SELECT * FROM subscription_plans WHERE id = ? AND is_active = 1')
      .get(planId) as any;

    if (!newPlan) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    // Check if it's actually an upgrade (simplified)
    const tierOrder = ['free', 'basic', 'premium', 'business'];
    const currentIndex = tierOrder.indexOf(currentSubscription.current_tier);
    const newIndex = tierOrder.indexOf(newPlan.tier);

    if (newIndex <= currentIndex) {
      return res.status(400).json({
        success: false,
        error: 'Can only upgrade to a higher tier'
      });
    }

    // Calculate pro-rated amount (simplified - just charge the difference)
    const amount = currentSubscription.billing_cycle === 'monthly'
      ? newPlan.price_monthly
      : newPlan.price_yearly;

    // Update current subscription
    db.prepare('UPDATE subscriptions SET is_active = 0 WHERE id = ?')
      .run(currentSubscription.id);

    // Create new subscription with remaining time
    const subscriptionId = randomUUID();
    const startDate = new Date().toISOString();
    const endDate = currentSubscription.end_date; // Keep same end date

    db.prepare(
      `
      INSERT INTO subscriptions (
        id, user_id, plan_id, billing_cycle, amount, start_date,
        end_date, is_active, auto_renew, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?)
      `
    ).run(
      subscriptionId,
      userId,
      planId,
      currentSubscription.billing_cycle,
      amount,
      startDate,
      endDate,
      new Date().toISOString(),
      new Date().toISOString()
    );

    // Update user's subscription tier
    db.prepare('UPDATE users SET subscription_tier = ? WHERE id = ?')
      .run(newPlan.tier, userId);

    return res.json({
      success: true,
      subscriptionId,
      message: 'Subscription upgraded successfully',
      newTier: newPlan.tier,
      expiresAt: endDate
    });
  } catch (error: any) {
    console.error('Error upgrading subscription:', error);
    return res.status(500).json({ success: false, error: 'Failed to upgrade subscription' });
  }
});

export default router;
