/**
 * User Controller
 * Handles HTTP requests for user operations
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AuthenticationError } from '../utils/errors';

/**
 * Get user profile
 * GET /api/users/profile
 */
export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const user = await authService.getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * PUT /api/users/profile
 */
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const { name, phone, businessName, businessType, avatarUrl } = req.body;

    const user = await authService.updateProfile(req.user.userId, {
      name,
      phone,
      businessName,
      businessType,
      avatarUrl
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user preferences
 * GET /api/users/preferences
 */
export async function getPreferences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const { getDb } = require('../config/database');
    const db = getDb();

    const preferences = db
      .prepare('SELECT * FROM user_preferences WHERE user_id = ?')
      .get(req.user.userId);

    if (!preferences) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Preferences not found',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        preferences: {
          id: preferences.id,
          userId: preferences.user_id,
          language: preferences.language,
          theme: preferences.theme,
          notificationsEnabled: Boolean(preferences.notifications_enabled),
          emailNotifications: Boolean(preferences.email_notifications),
          pushNotifications: Boolean(preferences.push_notifications),
          smsNotifications: Boolean(preferences.sms_notifications),
          currency: preferences.currency,
          timezone: preferences.timezone,
          createdAt: preferences.created_at,
          updatedAt: preferences.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user preferences
 * PUT /api/users/preferences
 */
export async function updatePreferences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const {
      language,
      theme,
      notificationsEnabled,
      emailNotifications,
      pushNotifications,
      smsNotifications,
      currency,
      timezone
    } = req.body;

    const preferences = await authService.updatePreferences(req.user.userId, {
      language,
      theme,
      notificationsEnabled,
      emailNotifications,
      pushNotifications,
      smsNotifications,
      currency,
      timezone
    });

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user account
 * DELETE /api/users/account
 */
export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    await authService.deleteAccount(req.user.userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user by ID (admin only)
 * GET /api/users/:id
 */
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const user = await authService.getUserById(id);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users (admin only)
 * GET /api/users
 */
export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { getDb } = require('../config/database');
    const db = getDb();

    const { page = 1, limit = 20, role, subscriptionTier, search } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM users WHERE deleted_at IS NULL';
    const params: any[] = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (subscriptionTier) {
      query += ' AND subscription_tier = ?';
      params.push(subscriptionTier);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const users = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL';
    const countParams: any[] = [];

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    if (subscriptionTier) {
      countQuery += ' AND subscription_tier = ?';
      countParams.push(subscriptionTier);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const { count } = db.prepare(countQuery).get(...countParams) as { count: number };

    res.status(200).json({
      success: true,
      data: {
        users: users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscription_tier,
          avatarUrl: user.avatar_url,
          phone: user.phone,
          businessName: user.business_name,
          businessType: user.business_type,
          isVerified: Boolean(user.is_verified),
          isActive: Boolean(user.is_active),
          lastLogin: user.last_login,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
}
