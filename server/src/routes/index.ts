/**
 * Master Router - Mounts all API routes
 */

import { Router } from 'express';

// Import all route modules
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './products.routes';
import watchlistRoutes from './watchlist.routes';
import alertsRoutes from './alerts.routes';
import notificationsRoutes from './notifications.routes';
import predictionsRoutes from './predictions.routes';
import analyticsRoutes from './analytics.routes';
import healthRoutes from './health.routes';
import festivalsRoutes from './festivals.routes';
import dealsRoutes from './deals.routes';
import chatRoutes from './chat.routes';
import msmeRoutes from './msme.routes';
import subscriptionsRoutes from './subscriptions.routes';
import paymentsRoutes from './payments.routes';

const router = Router();

/**
 * Mount all routes
 */

// Health check (no auth required)
router.use('/health', healthRoutes);

// Authentication routes (no auth required for login/register)
router.use('/auth', authRoutes);

// User routes (auth required)
router.use('/users', userRoutes);

// Product routes (optional auth)
router.use('/products', productRoutes);

// Analytics (optional auth)
router.use('/analytics', analyticsRoutes);

// Core features (auth required)
router.use('/watchlist', watchlistRoutes);
router.use('/alerts', alertsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/predictions', predictionsRoutes);

// Community & content
router.use('/festivals', festivalsRoutes);
router.use('/deals', dealsRoutes);
router.use('/chat', chatRoutes);

// MSME features
router.use('/msme', msmeRoutes);

// Monetization
router.use('/subscriptions', subscriptionsRoutes);
router.use('/payments', paymentsRoutes);

// Default route
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'RetailIQ API v1.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      watchlist: '/api/watchlist',
      alerts: '/api/alerts',
      notifications: '/api/notifications',
      predictions: '/api/predictions',
      analytics: '/api/analytics',
      festivals: '/api/festivals',
      deals: '/api/deals',
      chat: '/api/chat',
      msme: '/api/msme',
      subscriptions: '/api/subscriptions',
      payments: '/api/payments'
    },
    documentation: 'https://github.com/retailiq/api-docs'
  });
});

export default router;
