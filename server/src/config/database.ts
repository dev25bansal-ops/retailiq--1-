import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { env } from './env';
import logger from './logger';

let db: Database.Database;

export const initDatabase = (): Database.Database => {
  try {
    // Create database connection
    db = new Database(env.DB_PATH, {
      verbose: env.NODE_ENV === 'development' ? logger.debug.bind(logger) : undefined,
    });

    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL');

    // Optimize SQLite settings
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = 10000');
    db.pragma('temp_store = MEMORY');
    db.pragma('mmap_size = 30000000000');
    db.pragma('page_size = 4096');

    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    logger.info('Database connection established');

    // Read and execute schema
    const schemaPath = join(__dirname, '../../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    db.transaction(() => {
      for (const statement of statements) {
        db.exec(statement);
      }
    })();

    logger.info('Database schema initialized successfully');

    return db;
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    throw error;
  }
};

export const getDatabase = (): Database.Database => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    logger.info('Database connection closed');
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

export { db };

// Alias for compatibility with seed scripts
export const getDb = getDatabase;
