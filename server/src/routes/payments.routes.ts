/**
 * Payment Routes
 * Manages Razorpay payment orders, verification, and history
 */

import { Router, Request, Response } from 'express';
import { getDb } from '../config/database';
import { requireAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * POST /create-order - Create Razorpay order
 * @access Private
 */
router.post('/create-order', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { amount, currency, subscriptionId, description } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required'
      });
    }

    const db = getDb();

    // Create transaction record
    const transactionId = randomUUID();
    const razorpayOrderId = `order_${randomUUID().replace(/-/g, '').substring(0, 14)}`;

    db.prepare(
      `
      INSERT INTO transactions (
        id, user_id, subscription_id, amount, currency,
        payment_method, payment_gateway_id, status,
        description, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, 'razorpay', ?, 'pending', ?, ?, ?)
      `
    ).run(
      transactionId,
      userId,
      subscriptionId || null,
      amount,
      currency || 'INR',
      razorpayOrderId,
      description || null,
      new Date().toISOString(),
      new Date().toISOString()
    );

    // In a real implementation, this would call Razorpay API
    // For now, return mock order details
    return res.json({
      success: true,
      orderId: razorpayOrderId,
      transactionId,
      amount,
      currency: currency || 'INR',
      // In production, include Razorpay key and other details
      key: 'rzp_test_mock_key',
      name: 'RetailIQ',
      description: description || 'RetailIQ Subscription Payment',
      prefill: {
        email: (req as any).user.email,
        contact: ''
      }
    });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
});

/**
 * POST /verify - Verify Razorpay payment
 * @access Private
 */
router.post('/verify', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionId
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields'
      });
    }

    const db = getDb();

    // Get transaction
    const transaction = db
      .prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?')
      .get(transactionId, userId) as any;

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Verify signature (in production, use actual Razorpay secret)
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_SECRET || '')
    //   .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    //   .digest('hex');

    // For demo purposes, accept any signature
    const isValidSignature = true; // expectedSignature === razorpaySignature;

    if (!isValidSignature) {
      // Update transaction as failed
      db.prepare('UPDATE transactions SET status = ?, updated_at = ? WHERE id = ?')
        .run('failed', new Date().toISOString(), transactionId);

      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }

    // Update transaction as completed
    const metadata = JSON.stringify({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      verifiedAt: new Date().toISOString()
    });

    db.prepare(
      'UPDATE transactions SET status = ?, metadata = ?, updated_at = ? WHERE id = ?'
    ).run('completed', metadata, new Date().toISOString(), transactionId);

    // If there's a subscription, activate it
    if (transaction.subscription_id) {
      db.prepare('UPDATE subscriptions SET is_active = 1 WHERE id = ?')
        .run(transaction.subscription_id);
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      transactionId,
      paymentId: razorpayPaymentId
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
});

/**
 * GET /history - Get payment history
 * @access Private
 */
router.get('/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { limit = 20, offset = 0, status } = req.query;
    const db = getDb();

    let query = `
      SELECT t.*,
             s.billing_cycle,
             sp.name as plan_name,
             sp.tier as plan_tier
      FROM transactions t
      LEFT JOIN subscriptions s ON t.subscription_id = s.id
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE t.user_id = ?
    `;
    const params: any[] = [userId];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const transactions = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM transactions WHERE user_id = ?';
    const countParams: any[] = [userId];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const total = db.prepare(countQuery).get(...countParams) as any;

    // Parse metadata for each transaction
    const parsedTransactions = transactions.map((t: any) => ({
      ...t,
      metadata: t.metadata ? JSON.parse(t.metadata) : null
    }));

    res.json({
      success: true,
      transactions: parsedTransactions,
      total: total.count,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error: any) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ success: false, error: 'Failed to get payment history' });
  }
});

/**
 * POST /apply-promo - Apply promo code
 * @access Private
 */
router.post('/apply-promo', requireAuth, async (req: Request, res: Response) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Promo code and amount are required'
      });
    }

    const db = getDb();

    // Get promo code
    const promo = db
      .prepare(
        `
        SELECT *
        FROM promo_codes
        WHERE code = ? AND is_active = 1
        `
      )
      .get(code.toUpperCase()) as any;

    if (!promo) {
      return res.status(404).json({
        success: false,
        error: 'Invalid promo code'
      });
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(promo.valid_from);
    const validUntil = new Date(promo.valid_until);

    if (now < validFrom || now > validUntil) {
      return res.status(400).json({
        success: false,
        error: 'Promo code has expired or is not yet valid'
      });
    }

    // Check usage limit
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return res.status(400).json({
        success: false,
        error: 'Promo code usage limit reached'
      });
    }

    // Calculate discount
    let discountAmount = 0;

    if (promo.discount_type === 'percentage') {
      discountAmount = (amount * promo.discount_value) / 100;
    } else {
      discountAmount = promo.discount_value;
    }

    // Ensure discount doesn't exceed amount
    discountAmount = Math.min(discountAmount, amount);

    const finalAmount = amount - discountAmount;

    // Increment used count
    db.prepare('UPDATE promo_codes SET used_count = used_count + 1 WHERE id = ?')
      .run(promo.id);

    return res.json({
      success: true,
      promoCode: code.toUpperCase(),
      originalAmount: amount,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
      discountType: promo.discount_type,
      discountValue: promo.discount_value
    });
  } catch (error: any) {
    console.error('Error applying promo code:', error);
    return res.status(500).json({ success: false, error: 'Failed to apply promo code' });
  }
});

export default router;
