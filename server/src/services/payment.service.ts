/**
 * Payment Service (Razorpay Mock)
 * In production, integrate with actual Razorpay API
 */

import crypto from 'crypto';
import { getDb } from '../config/database';

interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: string;
}

interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

interface RefundResponse {
  id: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'processed';
  createdAt: string;
}

class PaymentService {
  private razorpayKeySecret: string = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_key';

  /**
   * Create Razorpay order
   */
  async createOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<PaymentOrder> {
    // Generate mock order ID
    const orderId = `order_${crypto.randomBytes(12).toString('hex')}`;
    const receiptId = receipt || `receipt_${Date.now()}`;

    const order: PaymentOrder = {
      id: orderId,
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receiptId,
      status: 'created',
      createdAt: new Date().toISOString()
    };

    console.log('[Payment] Created order:', order);

    return order;
  }

  /**
   * Verify payment signature
   */
  verifyPayment(verification: PaymentVerification): boolean {
    // In production, verify using Razorpay signature
    // const generatedSignature = crypto
    //   .createHmac('sha256', this.razorpayKeySecret)
    //   .update(`${verification.orderId}|${verification.paymentId}`)
    //   .digest('hex');

    // return generatedSignature === verification.signature;

    // Mock: Always return true
    console.log('[Payment] Verifying payment:', verification);
    return true;
  }

  /**
   * Capture payment (for authorized payments)
   */
  async capturePayment(paymentId: string, amount: number): Promise<{
    success: boolean;
    paymentId: string;
    amount: number;
    status: string;
  }> {
    console.log(`[Payment] Capturing payment: ${paymentId}, amount: ${amount}`);

    return {
      success: true,
      paymentId,
      amount,
      status: 'captured'
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<{
    id: string;
    status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
    amount: number;
    currency: string;
  }> {
    console.log(`[Payment] Getting status for payment: ${paymentId}`);

    // Mock: Always return captured
    return {
      id: paymentId,
      status: 'captured',
      amount: 0, // Would fetch from database
      currency: 'INR'
    };
  }

  /**
   * Initiate refund
   */
  async initiateRefund(paymentId: string, amount?: number): Promise<RefundResponse> {
    const refundId = `rfnd_${crypto.randomBytes(12).toString('hex')}`;

    const refund: RefundResponse = {
      id: refundId,
      paymentId,
      amount: amount || 0, // Full refund if amount not specified
      status: 'processed',
      createdAt: new Date().toISOString()
    };

    console.log('[Payment] Initiated refund:', refund);

    return refund;
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundId: string): Promise<{
    id: string;
    status: 'pending' | 'processed' | 'failed';
    amount: number;
  }> {
    console.log(`[Payment] Getting refund status: ${refundId}`);

    return {
      id: refundId,
      status: 'processed',
      amount: 0
    };
  }

  /**
   * Create subscription (for recurring payments)
   */
  async createSubscription(
    planId: string,
    customerId: string,
    _totalCount?: number
  ): Promise<{
    id: string;
    planId: string;
    customerId: string;
    status: 'created' | 'active' | 'paused' | 'cancelled';
    createdAt: string;
  }> {
    const subscriptionId = `sub_${crypto.randomBytes(12).toString('hex')}`;

    const subscription = {
      id: subscriptionId,
      planId,
      customerId,
      status: 'created' as const,
      createdAt: new Date().toISOString()
    };

    console.log('[Payment] Created subscription:', subscription);

    return subscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{
    id: string;
    status: 'cancelled';
    cancelledAt: string;
  }> {
    console.log(`[Payment] Cancelling subscription: ${subscriptionId}`);

    return {
      id: subscriptionId,
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    };
  }

  /**
   * Validate promo code
   */
  async validatePromoCode(code: string, amount: number): Promise<{
    valid: boolean;
    discountAmount: number;
    discountPercent: number;
    finalAmount: number;
    message: string;
  }> {
    const db = getDb();

    try {
      // Get promo code from database
      const promo = db
        .prepare(
          `
        SELECT * FROM promo_codes
        WHERE code = ? AND is_active = 1
      `
        )
        .get(code) as any;

      if (!promo) {
        return {
          valid: false,
          discountAmount: 0,
          discountPercent: 0,
          finalAmount: amount,
          message: 'Invalid or expired promo code'
        };
      }

      // Check validity period
      const now = new Date();
      const validFrom = new Date(promo.valid_from);
      const validUntil = new Date(promo.valid_until);

      if (now < validFrom || now > validUntil) {
        return {
          valid: false,
          discountAmount: 0,
          discountPercent: 0,
          finalAmount: amount,
          message: 'Promo code has expired'
        };
      }

      // Check usage limit
      if (promo.max_uses && promo.used_count >= promo.max_uses) {
        return {
          valid: false,
          discountAmount: 0,
          discountPercent: 0,
          finalAmount: amount,
          message: 'Promo code usage limit reached'
        };
      }

      // Check minimum amount
      if (promo.min_amount && amount < promo.min_amount) {
        return {
          valid: false,
          discountAmount: 0,
          discountPercent: 0,
          finalAmount: amount,
          message: `Minimum amount ₹${promo.min_amount} required`
        };
      }

      // Calculate discount
      let discountAmount = 0;
      const discountPercent = promo.discount_percent || 0;

      if (promo.discount_type === 'percentage') {
        discountAmount = (amount * discountPercent) / 100;
        if (promo.max_discount && discountAmount > promo.max_discount) {
          discountAmount = promo.max_discount;
        }
      } else if (promo.discount_type === 'fixed') {
        discountAmount = promo.discount_amount || 0;
      }

      const finalAmount = Math.max(0, amount - discountAmount);

      return {
        valid: true,
        discountAmount: Math.round(discountAmount),
        discountPercent,
        finalAmount: Math.round(finalAmount),
        message: `Promo code applied successfully! You save ₹${Math.round(discountAmount)}`
      };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return {
        valid: false,
        discountAmount: 0,
        discountPercent: 0,
        finalAmount: amount,
        message: 'Error validating promo code'
      };
    }
  }

  /**
   * Apply promo code (increment usage count)
   */
  async applyPromoCode(code: string, userId: string): Promise<boolean> {
    const db = getDb();

    try {
      // Increment usage count
      db.prepare(
        `
        UPDATE promo_codes
        SET used_count = used_count + 1
        WHERE code = ?
      `
      ).run(code);

      // Log promo usage
      db.prepare(
        `
        INSERT INTO promo_usage (user_id, promo_code, used_at)
        VALUES (?, ?, ?)
      `
      ).run(userId, code, new Date().toISOString());

      return true;
    } catch (error) {
      console.error('Error applying promo code:', error);
      return false;
    }
  }

  /**
   * Record payment transaction
   */
  async recordTransaction(
    userId: string,
    orderId: string,
    paymentId: string,
    amount: number,
    currency: string,
    status: 'success' | 'failed',
    metadata?: any
  ): Promise<string> {
    const db = getDb();

    try {
      const result = db
        .prepare(
          `
        INSERT INTO payment_transactions
        (user_id, order_id, payment_id, amount, currency, status, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          userId,
          orderId,
          paymentId,
          amount,
          currency,
          status,
          JSON.stringify(metadata || {}),
          new Date().toISOString()
        );

      return result.lastInsertRowid.toString();
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  }

  /**
   * Get user payment history
   */
  getUserPayments(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): {
    transactions: any[];
    total: number;
  } {
    const db = getDb();

    try {
      const transactions = db
        .prepare(
          `
        SELECT * FROM payment_transactions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `
        )
        .all(userId, limit, offset) as any[];

      const totalResult = db
        .prepare(
          `
        SELECT COUNT(*) as count FROM payment_transactions
        WHERE user_id = ?
      `
        )
        .get(userId) as any;

      return {
        transactions: transactions.map(t => ({
          ...t,
          metadata: t.metadata ? JSON.parse(t.metadata) : null
        })),
        total: totalResult.count
      };
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return { transactions: [], total: 0 };
    }
  }

  /**
   * Generate invoice (mock)
   */
  async generateInvoice(transactionId: string): Promise<{
    invoiceNumber: string;
    downloadUrl: string;
  }> {
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[Payment] Generated invoice: ${invoiceNumber} for transaction: ${transactionId}`);

    return {
      invoiceNumber,
      downloadUrl: `/api/payments/invoice/${invoiceNumber}.pdf`
    };
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(userId: string): boolean {
    const db = getDb();

    try {
      const subscription = db
        .prepare(
          `
        SELECT * FROM subscriptions
        WHERE user_id = ? AND status = 'active' AND valid_until > ?
      `
        )
        .get(userId, new Date().toISOString()) as any;

      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Get webhook signature for verification
   */
  generateWebhookSignature(payload: string): string {
    return crypto.createHmac('sha256', this.razorpayKeySecret).update(payload).digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = this.generateWebhookSignature(payload);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }
}

export const paymentService = new PaymentService();
