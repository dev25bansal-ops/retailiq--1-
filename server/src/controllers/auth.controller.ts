/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import logger from '../config/logger';

/**
 * Register new user
 * POST /api/auth/register
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, role, businessName, businessType, phone } = req.body;

    const result = await authService.registerUser(name, email, password, role, {
      businessName,
      businessType,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * OAuth Google login
 * POST /api/auth/oauth/google
 */
export async function oauthGoogle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accessToken: _accessToken, profile } = req.body;

    // In production, verify the accessToken with Google's API
    // For now, we trust the profile data from the client

    const result = await authService.loginWithOAuth('google', profile);

    res.status(200).json({
      success: true,
      message: result.isNewUser
        ? 'Account created successfully'
        : 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
        isNewUser: result.isNewUser
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * OAuth Facebook login
 * POST /api/auth/oauth/facebook
 */
export async function oauthFacebook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { accessToken: _accessToken, profile } = req.body;

    // In production, verify the accessToken with Facebook's API
    // For now, we trust the profile data from the client

    const result = await authService.loginWithOAuth('facebook', profile);

    res.status(200).json({
      success: true,
      message: result.isNewUser
        ? 'Account created successfully'
        : 'Login successful',
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
        isNewUser: result.isNewUser
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh-token
 */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshTokens(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Forgot password
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    // Always return success to prevent email enumeration
    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  } catch (error) {
    // Log error but still return success to prevent email enumeration
    logger.error('Forgot password error', { error });

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
  }
}

/**
 * Get current user (for testing auth)
 * GET /api/auth/me
 */
export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Not authenticated',
          code: 'NOT_AUTHENTICATED',
          statusCode: 401
        }
      });
      return;
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
