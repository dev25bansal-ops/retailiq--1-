/**
 * Email Service (Mock Implementation)
 * In production, integrate with SendGrid, AWS SES, or similar
 */

import { getDb } from '../config/database';

class EmailService {
  /**
   * Send email (mock implementation)
   */
  async sendEmail(
    to: string,
    subject: string,
    body: string,
    _isHtml: boolean = false
  ): Promise<boolean> {
    console.log('=== EMAIL SENT ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log('==================\n');

    // Log to database
    const db = getDb();
    try {
      db.prepare(
        `
        INSERT INTO notification_log
        (user_id, channel, status, metadata, sent_at)
        VALUES (?, 'email', 'sent', ?, ?)
      `
      ).run(
        null, // User ID would be looked up in production
        JSON.stringify({ to, subject }),
        new Date().toISOString()
      );
    } catch (error) {
      console.error('Error logging email:', error);
    }

    return true;
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const subject = 'Welcome to RetailIQ!';
    const body = this.formatWelcome(name);
    return this.sendEmail(to, subject, body, true);
  }

  /**
   * Send price alert email
   */
  async sendPriceAlert(
    to: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    platform: string,
    productUrl?: string
  ): Promise<boolean> {
    const subject = `Price Drop Alert: ${productName}`;
    const body = this.formatPriceAlert(productName, oldPrice, newPrice, platform, productUrl);
    return this.sendEmail(to, subject, body, true);
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(
    to: string,
    name: string,
    title: string,
    message: string,
    actionUrl?: string
  ): Promise<boolean> {
    const subject = title;
    const body = this.formatNotification(name, title, message, actionUrl);
    return this.sendEmail(to, subject, body, true);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
    const subject = 'Password Reset Request - RetailIQ';
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const body = this.formatPasswordReset(name, resetUrl);
    return this.sendEmail(to, subject, body, true);
  }

  /**
   * Send subscription confirmation email
   */
  async sendSubscriptionEmail(
    to: string,
    name: string,
    planName: string,
    amount: number,
    validUntil: string
  ): Promise<boolean> {
    const subject = `Subscription Confirmed - ${planName}`;
    const body = this.formatSubscription(name, planName, amount, validUntil);
    return this.sendEmail(to, subject, body, true);
  }

  /**
   * Send daily price summary email
   */
  async sendDailySummary(
    to: string,
    name: string,
    products: Array<{
      name: string;
      currentPrice: number;
      yesterdayPrice: number;
      change: number;
      platform: string;
    }>
  ): Promise<boolean> {
    const subject = 'Your Daily Price Summary - RetailIQ';
    const body = this.formatDailySummary(name, products);
    return this.sendEmail(to, subject, body, true);
  }

  /**
   * Format welcome email
   */
  formatWelcome(name: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to RetailIQ, ${name}! 👋</h1>

            <p>Thank you for joining RetailIQ - your smart shopping companion!</p>

            <p>Here's what you can do with RetailIQ:</p>
            <ul>
              <li>Track prices across multiple e-commerce platforms</li>
              <li>Get instant alerts when prices drop</li>
              <li>View AI-powered price predictions</li>
              <li>Get personalized buy/wait recommendations</li>
              <li>Discover the best deals during festivals</li>
            </ul>

            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                 style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                Start Tracking Prices
              </a>
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Happy Shopping!<br>
              The RetailIQ Team
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format price alert email
   */
  formatPriceAlert(
    productName: string,
    oldPrice: number,
    newPrice: number,
    platform: string,
    productUrl?: string
  ): string {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    const savings = oldPrice - newPrice;

    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h1 style="margin: 0;">🎉 Price Drop Alert!</h1>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; margin-top: 20px;">
              <h2 style="color: #1f2937; margin-top: 0;">${productName}</h2>

              <p style="font-size: 18px;">
                <strong>Platform:</strong> ${platform.charAt(0).toUpperCase() + platform.slice(1)}
              </p>

              <div style="display: flex; gap: 20px; margin: 20px 0;">
                <div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Was</p>
                  <p style="margin: 5px 0; font-size: 24px; text-decoration: line-through; color: #ef4444;">
                    ₹${oldPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Now</p>
                  <p style="margin: 5px 0; font-size: 32px; font-weight: bold; color: #10b981;">
                    ₹${newPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div style="background: #dcfce7; padding: 12px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px;">
                  <strong>You save:</strong> ₹${savings.toLocaleString('en-IN')} (${discount}% off)
                </p>
              </div>

              ${
                productUrl
                  ? `
                <p>
                  <a href="${productUrl}"
                     style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                    View Deal
                  </a>
                </p>
              `
                  : ''
              }
            </div>

            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              This price may change at any time. Act fast to grab this deal!
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format generic notification email
   */
  formatNotification(name: string, title: string, message: string, actionUrl?: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Hi ${name}!</h1>

            <h2 style="color: #1f2937;">${title}</h2>

            <p>${message}</p>

            ${
              actionUrl
                ? `
              <p>
                <a href="${actionUrl}"
                   style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                  Take Action
                </a>
              </p>
            `
                : ''
            }

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Best regards,<br>
              The RetailIQ Team
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format password reset email
   */
  formatPasswordReset(name: string, resetUrl: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Password Reset Request</h1>

            <p>Hi ${name},</p>

            <p>We received a request to reset your password for your RetailIQ account.</p>

            <p>
              <a href="${resetUrl}"
                 style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Best regards,<br>
              The RetailIQ Team
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format subscription email
   */
  formatSubscription(name: string, planName: string, amount: number, validUntil: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <h1 style="margin: 0;">🎉 Subscription Activated!</h1>
            </div>

            <div style="padding: 20px; background: #f9fafb; border-radius: 8px; margin-top: 20px;">
              <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}!</h2>

              <p>Your <strong>${planName}</strong> subscription has been successfully activated.</p>

              <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Plan:</strong> ${planName}</p>
                <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${amount.toLocaleString('en-IN')}</p>
                <p style="margin: 5px 0;"><strong>Valid Until:</strong> ${new Date(validUntil).toLocaleDateString('en-IN')}</p>
              </div>

              <p>Enjoy all the premium features!</p>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Thank you for your purchase!<br>
              The RetailIQ Team
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Format daily summary email
   */
  formatDailySummary(
    name: string,
    products: Array<{
      name: string;
      currentPrice: number;
      yesterdayPrice: number;
      change: number;
      platform: string;
    }>
  ): string {
    const productRows = products
      .map(
        p => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${p.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">₹${p.currentPrice.toLocaleString('en-IN')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: ${p.change < 0 ? '#10b981' : '#ef4444'};">
          ${p.change > 0 ? '+' : ''}${p.change.toFixed(1)}%
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${p.platform}</td>
      </tr>
    `
      )
      .join('');

    return `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Daily Price Summary</h1>

            <p>Hi ${name}!</p>

            <p>Here's your daily price update for tracked products:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: left;">Price</th>
                  <th style="padding: 10px; text-align: left;">Change</th>
                  <th style="padding: 10px; text-align: left;">Platform</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>

            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/watchlist"
                 style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                View Full Watchlist
              </a>
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Happy Shopping!<br>
              The RetailIQ Team
            </p>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
