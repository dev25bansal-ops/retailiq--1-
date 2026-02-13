/**
 * SMS Service (Mock Implementation)
 * In production, integrate with Twilio, MSG91, or similar
 */

import { getDb } from '../config/database';

class SMSService {
  /**
   * Send SMS (mock implementation)
   */
  async sendSMS(to: string, message: string): Promise<boolean> {
    console.log('=== SMS SENT ===');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('================\n');

    // Log to database
    const db = getDb();
    try {
      db.prepare(
        `
        INSERT INTO notification_log
        (user_id, channel, status, metadata, sent_at)
        VALUES (?, 'sms', 'sent', ?, ?)
      `
      ).run(
        null, // User ID would be looked up in production
        JSON.stringify({ to, length: message.length }),
        new Date().toISOString()
      );
    } catch (error) {
      console.error('Error logging SMS:', error);
    }

    return true;
  }

  /**
   * Send price alert SMS
   */
  async sendPriceAlertSMS(
    to: string,
    productName: string,
    newPrice: number,
    discount: number
  ): Promise<boolean> {
    const message = `Price Alert! ${productName} is now ₹${newPrice} (${discount}% off). Check RetailIQ for details.`;
    return this.sendSMS(to, message);
  }

  /**
   * Send OTP SMS
   */
  async sendOTP(to: string, otp: string): Promise<boolean> {
    const message = `Your RetailIQ verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;
    return this.sendSMS(to, message);
  }

  /**
   * Send deal alert SMS
   */
  async sendDealAlert(to: string, dealInfo: string): Promise<boolean> {
    const message = `Hot Deal Alert! ${dealInfo}. Visit RetailIQ to grab it now!`;
    return this.sendSMS(to, message);
  }

  /**
   * Send subscription reminder SMS
   */
  async sendSubscriptionReminder(to: string, daysLeft: number): Promise<boolean> {
    const message = `Your RetailIQ subscription expires in ${daysLeft} days. Renew now to continue enjoying premium features.`;
    return this.sendSMS(to, message);
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(
    recipients: string[],
    message: string
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        await this.sendSMS(recipient, message);
        sent++;
      } catch (error) {
        console.error(`Failed to send SMS to ${recipient}:`, error);
        failed++;
      }
    }

    console.log(`Bulk SMS: ${sent} sent, ${failed} failed`);

    return { sent, failed };
  }

  /**
   * Format phone number to international format
   */
  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Add +91 if not present (India)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    // Add + prefix
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }

  /**
   * Validate phone number
   */
  validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');

    // Indian phone number validation (10 digits)
    if (cleaned.length === 10) {
      return /^[6-9]\d{9}$/.test(cleaned);
    }

    // International format with country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return /^91[6-9]\d{9}$/.test(cleaned);
    }

    return false;
  }

  /**
   * Get SMS delivery status (mock)
   */
  async getDeliveryStatus(_messageId: string): Promise<{
    status: 'sent' | 'delivered' | 'failed';
    timestamp: string;
  }> {
    // In production, query the SMS provider API
    return {
      status: 'delivered',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate SMS cost (mock)
   */
  calculateCost(message: string, recipients: number = 1): {
    segments: number;
    costPerSMS: number;
    totalCost: number;
  } {
    // Standard SMS is 160 characters
    const segments = Math.ceil(message.length / 160);
    const costPerSMS = 0.25; // ₹0.25 per SMS in India (typical rate)
    const totalCost = segments * recipients * costPerSMS;

    return {
      segments,
      costPerSMS,
      totalCost
    };
  }
}

export const smsService = new SMSService();
