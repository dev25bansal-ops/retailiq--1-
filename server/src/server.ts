import app from './app';
import { env } from './config/env';
import logger from './config/logger';
import { initDatabase } from './config/database';

// Initialize database
try {
  initDatabase();
  logger.info('Database initialized successfully');
} catch (error) {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
}

// Initialize scheduler for price scraping and other cron jobs
try {
  const { initScheduler } = require('./services/scheduler.service');
  initScheduler();
  logger.info('Scheduler initialized successfully');
} catch (error) {
  logger.error('Failed to initialize scheduler:', error);
  // Don't exit - scheduler is non-critical
}

// Start server
const PORT = env.PORT || 3000;
const HOST = env.HOST || 'localhost';

const server = app.listen(PORT, () => {
  logger.info(`
    ╔═══════════════════════════════════════════════╗
    ║                                               ║
    ║   RetailIQ Server Started Successfully!       ║
    ║                                               ║
    ║   Environment: ${env.NODE_ENV.padEnd(32)} ║
    ║   Server:      http://${HOST}:${PORT.toString().padEnd(20)} ║
    ║   Health:      http://${HOST}:${PORT}/health${' '.repeat(10)} ║
    ║   API:         http://${HOST}:${PORT}/api${' '.repeat(13)} ║
    ║                                               ║
    ╚═══════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Stop scheduler
    try {
      const { stopScheduler } = require('./services/scheduler.service');
      stopScheduler();
      logger.info('Scheduler stopped');
    } catch (error) {
      logger.error('Failed to stop scheduler:', error);
    }

    // Close database connection
    try {
      const { closeDatabase } = require('./config/database');
      closeDatabase();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Failed to close database:', error);
    }

    logger.info('Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  // In production, you might want to exit the process
  if (env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  // Always exit on uncaught exception
  process.exit(1);
});

export default server;
