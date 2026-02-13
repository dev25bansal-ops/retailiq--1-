# RetailIQ Authentication & Middleware System

Complete production-quality authentication and middleware system for the RetailIQ backend.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Middleware Components](#middleware-components)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Security Features](#security-features)
- [Error Handling](#error-handling)

## Architecture Overview

The authentication system is built with the following components:

```
┌─────────────────┐
│   HTTP Request  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Rate Limiter   │ ← Protects against abuse
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Validator     │ ← Validates request data
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Auth Guard    │ ← Verifies JWT token
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Subscription    │ ← Checks tier permissions
│     Guard       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Controller    │ ← Handles business logic
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Service      │ ← Interacts with database
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Error Handler  │ ← Formats error response
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  HTTP Response  │
└─────────────────┘
```

## File Structure

```
server/src/
├── config/
│   ├── database.ts          # SQLite database configuration
│   └── logger.ts            # Winston logger setup
├── middleware/
│   ├── auth.ts              # JWT authentication middleware
│   ├── errorHandler.ts      # Global error handler
│   ├── rateLimiter.ts       # Rate limiting
│   ├── validator.ts         # Request validation with Zod
│   ├── subscription.ts      # Subscription tier gating
│   └── index.ts             # Middleware exports
├── services/
│   └── auth.service.ts      # Authentication business logic
├── controllers/
│   ├── auth.controller.ts   # Auth HTTP handlers
│   └── user.controller.ts   # User HTTP handlers
├── routes/
│   ├── auth.routes.ts       # Auth route definitions
│   └── user.routes.ts       # User route definitions
├── utils/
│   ├── errors.ts            # Custom error classes
│   └── jwt.ts               # JWT utilities
├── types/
│   └── express.d.ts         # Express type extensions
└── index.ts                 # Server entry point
```

## Features

### 1. JWT Authentication
- Access tokens (1 hour expiry)
- Refresh tokens (7 days expiry)
- Token rotation on refresh
- Secure token storage with SHA-256 hashing

### 2. User Management
- Registration with email/password
- Login with credentials
- OAuth support (Google, Facebook)
- Profile management
- User preferences
- Account soft deletion

### 3. Rate Limiting
- General: 100 requests/15 minutes
- Auth: 10 requests/15 minutes
- API: 200 requests/15 minutes
- Password reset: 3 requests/hour
- Upload: 20 requests/hour

### 4. Subscription Tiers
- **Free**: 50 products, 100 transactions/month
- **Basic**: 500 products, 1000 transactions/month, AI features
- **Pro**: 5000 products, 10000 transactions/month, advanced reports
- **Enterprise**: Unlimited everything

### 5. Request Validation
- Body, query, and params validation
- Zod schemas for type safety
- Descriptive error messages

### 6. Error Handling
- Structured error responses
- Proper HTTP status codes
- Stack traces in development
- Error logging with Winston

## Middleware Components

### 1. Authentication Middleware

```typescript
import { requireAuth, optionalAuth, requireAdmin } from './middleware';

// Require authentication
router.get('/protected', requireAuth, handler);

// Optional authentication
router.get('/public', optionalAuth, handler);

// Admin only
router.delete('/users/:id', requireAuth, requireAdmin, handler);
```

### 2. Validation Middleware

```typescript
import { validateBody, loginSchema } from './middleware';

router.post('/login', validateBody(loginSchema), handler);
```

### 3. Rate Limiter Middleware

```typescript
import { authLimiter, apiLimiter } from './middleware';

router.post('/login', authLimiter, handler);
router.get('/products', apiLimiter, handler);
```

### 4. Subscription Middleware

```typescript
import { requireProTier, requireFeature } from './middleware';

// Require Pro tier or higher
router.get('/advanced-reports', requireAuth, requireProTier, handler);

// Require specific feature
router.get('/forecast', requireAuth, requireFeature('priceForecasting'), handler);
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",
  "businessName": "My Store",
  "phone": "+919876543210"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "subscriptionTier": "free"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### OAuth Login (Google/Facebook)
```http
POST /api/auth/oauth/google
Content-Type: application/json

{
  "provider": "google",
  "accessToken": "google-access-token",
  "profile": {
    "id": "google-user-id",
    "email": "john@example.com",
    "name": "John Doe",
    "picture": "https://example.com/photo.jpg"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+919876543210",
  "businessName": "Updated Store Name"
}
```

#### Get Preferences
```http
GET /api/users/preferences
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Update Preferences
```http
PUT /api/users/preferences
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "language": "hi",
  "theme": "dark",
  "currency": "INR",
  "notificationsEnabled": true
}
```

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Usage Examples

### 1. Basic Server Setup

```typescript
import express from 'express';
import { initializeDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Initialize database
initializeDatabase();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

### 2. Protected Route with Subscription Check

```typescript
import { Router } from 'express';
import { requireAuth, requireProTier, asyncHandler } from './middleware';

const router = Router();

router.get(
  '/advanced-analytics',
  requireAuth,
  requireProTier,
  asyncHandler(async (req, res) => {
    // Only Pro and Enterprise users can access
    const analytics = await getAdvancedAnalytics(req.user!.userId);
    res.json({ success: true, data: analytics });
  })
);

export default router;
```

### 3. Custom Validation Schema

```typescript
import { z } from 'zod';
import { validateBody } from './middleware';

const customSchema = z.object({
  productName: z.string().min(3).max(100),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'food'])
});

router.post(
  '/products',
  requireAuth,
  validateBody(customSchema),
  asyncHandler(async (req, res) => {
    // Request body is validated
    const product = await createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  })
);
```

### 4. Role-Based Access Control

```typescript
import { requireAuth, requireRole } from './middleware';

// Admin and manager only
router.delete(
  '/products/:id',
  requireAuth,
  requireRole('admin', 'manager'),
  asyncHandler(async (req, res) => {
    await deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  })
);
```

## Security Features

### 1. Password Security
- Bcrypt hashing with 10 rounds
- No plain text password storage
- Secure password reset flow

### 2. Token Security
- JWT with HS256 algorithm
- Short-lived access tokens (1 hour)
- Refresh token rotation
- Token revocation on logout
- Secure token storage with SHA-256

### 3. Request Security
- Rate limiting by IP
- Request validation
- CORS configuration
- Helmet security headers
- Input sanitization

### 4. Database Security
- Prepared statements (SQL injection prevention)
- Foreign key constraints
- Soft deletion
- Audit logging

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400) - Invalid request data
- `AUTHENTICATION_ERROR` (401) - Invalid or missing token
- `AUTHORIZATION_ERROR` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `DUPLICATE_ENTRY` (409) - Resource already exists
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

### Custom Error Classes

```typescript
import {
  AuthenticationError,
  ValidationError,
  NotFoundError
} from './utils/errors';

// Throw custom errors in your code
if (!user) {
  throw new NotFoundError('User not found');
}

if (!isValidPassword) {
  throw new AuthenticationError('Invalid credentials');
}
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_PATH=./database/retailiq.db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info

# Rate Limiting (optional)
SKIP_RATE_LIMIT=false
```

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Import the API endpoints as a collection
2. Set up environment variables for BASE_URL and TOKEN
3. Use {{BASE_URL}} and {{TOKEN}} in your requests

## Next Steps

1. **Add More Routes**: Create routes for products, transactions, etc.
2. **Implement Email**: Set up actual email sending for password reset
3. **Add OAuth Providers**: Integrate real OAuth with Google/Facebook APIs
4. **Implement 2FA**: Add two-factor authentication
5. **Add Logging**: Enhance audit logging for security events
6. **Add Tests**: Write unit and integration tests

## Support

For issues or questions:
- Check the error logs in `logs/` directory
- Review the Winston logs for detailed error information
- Use the health check endpoint: `GET /health`

---

Built with Node.js, Express, TypeScript, and SQLite.
