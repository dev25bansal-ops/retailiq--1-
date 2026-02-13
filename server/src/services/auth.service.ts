/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { getDb } from '../config/database';
import { generateTokenPair, verifyRefreshToken, TokenPair } from '../utils/jwt';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError
} from '../utils/errors';
import logger from '../config/logger';

const BCRYPT_ROUNDS = 10;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptionTier: string;
  avatarUrl?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  language: string;
  theme: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

interface UserWithPassword extends User {
  passwordHash: string;
}

/**
 * Hash password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sanitize user object (remove password hash)
 */
function sanitizeUser(user: any): User {
  const { password_hash, deleted_at, ...sanitized } = user;
  return {
    id: sanitized.id,
    name: sanitized.name,
    email: sanitized.email,
    role: sanitized.role,
    subscriptionTier: sanitized.subscription_tier,
    avatarUrl: sanitized.avatar_url,
    phone: sanitized.phone,
    businessName: sanitized.business_name,
    businessType: sanitized.business_type,
    isVerified: Boolean(sanitized.is_verified),
    isActive: Boolean(sanitized.is_active),
    lastLogin: sanitized.last_login,
    createdAt: sanitized.created_at,
    updatedAt: sanitized.updated_at
  };
}

/**
 * Register new user
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string = 'user',
  additionalData?: {
    businessName?: string;
    businessType?: string;
    phone?: string;
  }
): Promise<{ user: User; tokens: TokenPair }> {
  const db = getDb();

  try {
    // Check if user already exists
    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ? AND deleted_at IS NULL')
      .get(email);

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate IDs
    const userId = uuidv4();
    const preferencesId = uuidv4();
    const now = new Date().toISOString();

    // Start transaction
    const insertUser = db.prepare(`
      INSERT INTO users (
        id, name, email, password_hash, role, subscription_tier,
        business_name, business_type, phone, is_verified, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertPreferences = db.prepare(`
      INSERT INTO user_preferences (
        id, user_id, language, theme, notifications_enabled,
        email_notifications, push_notifications, sms_notifications,
        currency, timezone, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertUser.run(
        userId,
        name,
        email,
        passwordHash,
        role,
        'free', // Default subscription tier
        additionalData?.businessName || null,
        additionalData?.businessType || null,
        additionalData?.phone || null,
        0, // is_verified
        1, // is_active
        now,
        now
      );

      insertPreferences.run(
        preferencesId,
        userId,
        'en', // default language
        'light', // default theme
        1, // notifications_enabled
        1, // email_notifications
        0, // push_notifications
        0, // sms_notifications
        'INR', // default currency
        'Asia/Kolkata', // default timezone
        now,
        now
      );
    });

    transaction();

    // Fetch created user
    const createdUser = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(userId) as UserWithPassword;

    const user = sanitizeUser(createdUser);

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier
    });

    // Store refresh token
    await storeRefreshToken(userId, tokens.refreshToken);

    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { user, tokens };
  } catch (error) {
    logger.error('User registration failed', { error, email });
    throw error;
  }
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; tokens: TokenPair }> {
  const db = getDb();

  try {
    // Find user by email
    const userRow = db
      .prepare('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL')
      .get(email) as UserWithPassword | undefined;

    if (!userRow) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!userRow.isActive) {
      throw new AuthenticationError('Account is inactive');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, userRow.passwordHash);

    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    const now = new Date().toISOString();
    db.prepare('UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?').run(
      now,
      now,
      userRow.id
    );

    const user = sanitizeUser({ ...userRow, last_login: now });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier
    });

    // Store refresh token
    await storeRefreshToken(user.id, tokens.refreshToken);

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email
    });

    return { user, tokens };
  } catch (error) {
    logger.error('Login failed', { error, email });
    throw error;
  }
}

/**
 * Login with OAuth
 */
export async function loginWithOAuth(
  provider: string,
  profile: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }
): Promise<{ user: User; tokens: TokenPair; isNewUser: boolean }> {
  const db = getDb();

  try {
    // Check if user exists
    let userRow = db
      .prepare('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL')
      .get(profile.email) as UserWithPassword | undefined;

    let isNewUser = false;

    if (!userRow) {
      // Create new user
      const userId = uuidv4();
      const preferencesId = uuidv4();
      const now = new Date().toISOString();

      // Generate random password for OAuth users
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await hashPassword(randomPassword);

      const insertUser = db.prepare(`
        INSERT INTO users (
          id, name, email, password_hash, role, subscription_tier,
          avatar_url, is_verified, is_active, last_login,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertPreferences = db.prepare(`
        INSERT INTO user_preferences (
          id, user_id, language, theme, notifications_enabled,
          email_notifications, push_notifications, sms_notifications,
          currency, timezone, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction(() => {
        insertUser.run(
          userId,
          profile.name,
          profile.email,
          passwordHash,
          'user',
          'free',
          profile.picture || null,
          1, // OAuth users are auto-verified
          1,
          now,
          now,
          now
        );

        insertPreferences.run(
          preferencesId,
          userId,
          'en',
          'light',
          1,
          1,
          0,
          0,
          'INR',
          'Asia/Kolkata',
          now,
          now
        );
      });

      transaction();

      userRow = db
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(userId) as UserWithPassword;

      isNewUser = true;

      logger.info('New user created via OAuth', {
        userId,
        email: profile.email,
        provider
      });
    } else {
      // Update last login
      const now = new Date().toISOString();
      db.prepare('UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?').run(
        now,
        now,
        userRow.id
      );
      (userRow as any).last_login = now;
    }

    const user = sanitizeUser(userRow);

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier
    });

    // Store refresh token
    await storeRefreshToken(user.id, tokens.refreshToken);

    logger.info('OAuth login successful', {
      userId: user.id,
      provider,
      isNewUser
    });

    return { user, tokens, isNewUser };
  } catch (error) {
    logger.error('OAuth login failed', { error, provider, email: profile.email });
    throw error;
  }
}

/**
 * Refresh access token
 */
export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  const db = getDb();

  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if refresh token exists and is not revoked
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = db
      .prepare(
        'SELECT * FROM refresh_tokens WHERE token_hash = ? AND is_revoked = 0 AND expires_at > ?'
      )
      .get(tokenHash, new Date().toISOString());

    if (!storedToken) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Get user
    const userRow = db
      .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
      .get(payload.userId) as UserWithPassword | undefined;

    if (!userRow || !userRow.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    const user = sanitizeUser(userRow);

    // Generate new token pair
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier
    });

    // Revoke old refresh token
    db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE token_hash = ?').run(
      tokenHash
    );

    // Store new refresh token
    await storeRefreshToken(user.id, tokens.refreshToken);

    logger.info('Tokens refreshed successfully', { userId: user.id });

    return tokens;
  } catch (error) {
    logger.error('Token refresh failed', { error });
    throw error;
  }
}

/**
 * Logout user (revoke refresh token)
 */
export async function logoutUser(refreshToken: string): Promise<void> {
  const db = getDb();

  try {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE token_hash = ?').run(
      tokenHash
    );

    logger.info('User logged out successfully');
  } catch (error) {
    logger.error('Logout failed', { error });
    throw error;
  }
}

/**
 * Store refresh token
 */
async function storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  const db = getDb();

  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const tokenId = uuidv4();
  const now = new Date().toISOString();

  // Token expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(tokenId, userId, tokenHash, expiresAt, now);
}

/**
 * Forgot password (mock implementation)
 */
export async function forgotPassword(email: string): Promise<void> {
  const db = getDb();

  try {
    const user = db
      .prepare('SELECT id, name, email FROM users WHERE email = ? AND deleted_at IS NULL')
      .get(email);

    if (!user) {
      // Don't reveal if email exists or not
      logger.info('Password reset requested for non-existent email', { email });
      return;
    }

    // Generate reset token (in production, store this in database)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Mock email sending
    console.log('\n==============================================');
    console.log('PASSWORD RESET EMAIL (Mock)');
    console.log('==============================================');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password - RetailIQ`);
    console.log(`\nHi ${(user as any).name},`);
    console.log('\nYou requested to reset your password. Click the link below:');
    console.log(`\n${resetLink}`);
    console.log('\nThis link will expire in 1 hour.');
    console.log('\nIf you did not request this, please ignore this email.');
    console.log('==============================================\n');

    logger.info('Password reset email sent (mock)', { email });
  } catch (error) {
    logger.error('Forgot password failed', { error, email });
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User> {
  const db = getDb();

  const userRow = db
    .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
    .get(userId);

  if (!userRow) {
    throw new NotFoundError('User not found');
  }

  return sanitizeUser(userRow);
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string;
    businessName?: string;
    businessType?: string;
    avatarUrl?: string;
  }
): Promise<User> {
  const db = getDb();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone);
    }
    if (data.businessName !== undefined) {
      updates.push('business_name = ?');
      values.push(data.businessName);
    }
    if (data.businessType !== undefined) {
      updates.push('business_type = ?');
      values.push(data.businessType);
    }
    if (data.avatarUrl !== undefined) {
      updates.push('avatar_url = ?');
      values.push(data.avatarUrl);
    }

    if (updates.length === 0) {
      throw new ValidationError('No fields to update');
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(userId);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      throw new NotFoundError('User not found');
    }

    logger.info('User profile updated', { userId });

    return getUserById(userId);
  } catch (error) {
    logger.error('Profile update failed', { error, userId });
    throw error;
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  userId: string,
  prefs: Partial<Omit<UserPreferences, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<UserPreferences> {
  const db = getDb();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (prefs.language !== undefined) {
      updates.push('language = ?');
      values.push(prefs.language);
    }
    if (prefs.theme !== undefined) {
      updates.push('theme = ?');
      values.push(prefs.theme);
    }
    if (prefs.notificationsEnabled !== undefined) {
      updates.push('notifications_enabled = ?');
      values.push(prefs.notificationsEnabled ? 1 : 0);
    }
    if (prefs.emailNotifications !== undefined) {
      updates.push('email_notifications = ?');
      values.push(prefs.emailNotifications ? 1 : 0);
    }
    if (prefs.pushNotifications !== undefined) {
      updates.push('push_notifications = ?');
      values.push(prefs.pushNotifications ? 1 : 0);
    }
    if (prefs.smsNotifications !== undefined) {
      updates.push('sms_notifications = ?');
      values.push(prefs.smsNotifications ? 1 : 0);
    }
    if (prefs.currency !== undefined) {
      updates.push('currency = ?');
      values.push(prefs.currency);
    }
    if (prefs.timezone !== undefined) {
      updates.push('timezone = ?');
      values.push(prefs.timezone);
    }

    if (updates.length === 0) {
      throw new ValidationError('No preferences to update');
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(userId);

    const query = `UPDATE user_preferences SET ${updates.join(', ')} WHERE user_id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      throw new NotFoundError('User preferences not found');
    }

    logger.info('User preferences updated', { userId });

    const updatedPrefs = db
      .prepare('SELECT * FROM user_preferences WHERE user_id = ?')
      .get(userId) as any;

    return {
      id: updatedPrefs.id,
      userId: updatedPrefs.user_id,
      language: updatedPrefs.language,
      theme: updatedPrefs.theme,
      notificationsEnabled: Boolean(updatedPrefs.notifications_enabled),
      emailNotifications: Boolean(updatedPrefs.email_notifications),
      pushNotifications: Boolean(updatedPrefs.push_notifications),
      smsNotifications: Boolean(updatedPrefs.sms_notifications),
      currency: updatedPrefs.currency,
      timezone: updatedPrefs.timezone,
      createdAt: updatedPrefs.created_at,
      updatedAt: updatedPrefs.updated_at
    };
  } catch (error) {
    logger.error('Preferences update failed', { error, userId });
    throw error;
  }
}

/**
 * Delete user account (soft delete)
 */
export async function deleteAccount(userId: string): Promise<void> {
  const db = getDb();

  try {
    const now = new Date().toISOString();

    const result = db
      .prepare('UPDATE users SET deleted_at = ?, is_active = 0, updated_at = ? WHERE id = ?')
      .run(now, now, userId);

    if (result.changes === 0) {
      throw new NotFoundError('User not found');
    }

    // Revoke all refresh tokens
    db.prepare('UPDATE refresh_tokens SET is_revoked = 1 WHERE user_id = ?').run(userId);

    logger.info('User account deleted', { userId });
  } catch (error) {
    logger.error('Account deletion failed', { error, userId });
    throw error;
  }
}
