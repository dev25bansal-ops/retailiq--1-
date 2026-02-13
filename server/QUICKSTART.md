# RetailIQ Backend - Quick Start Guide

Get the RetailIQ authentication system up and running in minutes.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Installation

1. **Install Dependencies**

```bash
cd server
npm install
```

Required dependencies:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "better-sqlite3": "^9.2.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "uuid": "^9.0.1",
    "zod": "^3.22.4",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.5",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/uuid": "^9.0.7",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "@types/morgan": "^1.9.9",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

2. **Create Environment File**

Create `.env` in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_PATH=./database/retailiq.db

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=retailiq-super-secret-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=retailiq-refresh-secret-change-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug

# Rate Limiting
SKIP_RATE_LIMIT=false
```

3. **Build TypeScript**

```bash
npm run build
```

4. **Start Development Server**

```bash
npm run dev
```

Or for production:

```bash
npm start
```

## Verify Installation

1. **Health Check**

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "RetailIQ API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

2. **Register a Test User**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

4. **Test Protected Route**

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "types": ["node"],
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Common Issues

### Database Lock Error
If you get a "database is locked" error:
- Make sure only one instance of the server is running
- Delete `database/retailiq.db` and restart

### Port Already in Use
If port 5000 is busy:
- Change the PORT in `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill`

### Module Not Found
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## API Testing Tools

### Using Postman

1. Create a new collection "RetailIQ API"
2. Set up environment variables:
   - `BASE_URL`: `http://localhost:5000`
   - `TOKEN`: (will be set after login)
3. Import requests from the examples below

### Using REST Client (VS Code)

Create `test.http`:

```http
### Health Check
GET http://localhost:5000/health

### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "businessName": "My Store"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

### Get Profile (replace with your token)
GET http://localhost:5000/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Database Structure

The system automatically creates these tables:

- `users` - User accounts
- `user_preferences` - User settings
- `refresh_tokens` - Token management
- `products` - Product catalog
- `price_history` - Price tracking
- `transactions` - Sales/purchases
- `transaction_items` - Transaction details
- `audit_logs` - Security audit trail

View the database:
```bash
sqlite3 database/retailiq.db
.tables
.schema users
```

## Next Steps

1. **Explore the API** - Try all endpoints in AUTH_SYSTEM.md
2. **Add More Routes** - Create product and transaction routes
3. **Customize** - Modify schemas and add new features
4. **Deploy** - Follow deployment guide for production

## Development Tips

### Hot Reload
Using `nodemon`, changes to TypeScript files will automatically restart the server.

### Debugging
Add breakpoints in VS Code:
1. Create `.vscode/launch.json`
2. Use "Attach to Node Process"
3. Run `npm run dev` in terminal

### Logging
Check logs in:
- Console (development)
- `logs/combined.log` (production)
- `logs/error.log` (errors only)

### Database Inspection
Use SQLite browser or CLI:
```bash
# CLI
sqlite3 database/retailiq.db

# List all users
SELECT id, name, email, role, subscription_tier FROM users;

# Check refresh tokens
SELECT user_id, expires_at, is_revoked FROM refresh_tokens;
```

## Production Checklist

Before deploying to production:

- [ ] Change JWT secrets in environment variables
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure production logging
- [ ] Set up monitoring (e.g., PM2)
- [ ] Review rate limits
- [ ] Enable process management
- [ ] Set up reverse proxy (Nginx)

## Support

- **Documentation**: See AUTH_SYSTEM.md for complete API reference
- **Logs**: Check `logs/` directory for error details
- **Database**: Inspect SQLite database for data issues

---

Happy coding! 🚀
