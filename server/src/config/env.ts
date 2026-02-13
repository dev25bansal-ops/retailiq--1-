import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  DB_PATH: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_EXPIRY: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  EMAIL_FROM: string;
  SCRAPER_USER_AGENT: string;
  SCRAPER_TIMEOUT: number;
  SCRAPER_MAX_RETRIES: number;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  CLIENT_URL: string;
  AMAZON_AFFILIATE_ID: string;
  FLIPKART_AFFILIATE_ID: string;
  LOG_LEVEL: string;
  LOG_FILE_PATH: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const env: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: getEnvNumber('PORT', 3000),
  HOST: getEnvVar('HOST', 'localhost'),
  DB_PATH: getEnvVar('DB_PATH', './database/retailiq.db'),
  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRY: getEnvVar('JWT_ACCESS_EXPIRY', '15m'),
  JWT_REFRESH_EXPIRY: getEnvVar('JWT_REFRESH_EXPIRY', '7d'),
  RATE_LIMIT_WINDOW_MS: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000),
  RATE_LIMIT_MAX_REQUESTS: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  SMTP_HOST: getEnvVar('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: getEnvNumber('SMTP_PORT', 587),
  SMTP_SECURE: getEnvBoolean('SMTP_SECURE', false),
  SMTP_USER: getEnvVar('SMTP_USER', ''),
  SMTP_PASS: getEnvVar('SMTP_PASS', ''),
  EMAIL_FROM: getEnvVar('EMAIL_FROM', 'RetailIQ <noreply@retailiq.com>'),
  SCRAPER_USER_AGENT: getEnvVar(
    'SCRAPER_USER_AGENT',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  ),
  SCRAPER_TIMEOUT: getEnvNumber('SCRAPER_TIMEOUT', 30000),
  SCRAPER_MAX_RETRIES: getEnvNumber('SCRAPER_MAX_RETRIES', 3),
  RAZORPAY_KEY_ID: getEnvVar('RAZORPAY_KEY_ID', ''),
  RAZORPAY_KEY_SECRET: getEnvVar('RAZORPAY_KEY_SECRET', ''),
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:5173'),
  AMAZON_AFFILIATE_ID: getEnvVar('AMAZON_AFFILIATE_ID', ''),
  FLIPKART_AFFILIATE_ID: getEnvVar('FLIPKART_AFFILIATE_ID', ''),
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  LOG_FILE_PATH: getEnvVar('LOG_FILE_PATH', './logs'),
};

// Validate critical environment variables in production
if (env.NODE_ENV === 'production') {
  const requiredVars = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'SMTP_USER',
    'SMTP_PASS',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(
        `Environment variable ${varName} is required in production but not set`
      );
    }
  }
}

export default env;
