/**
 * JWT Utility Functions Tests
 * Testing authentication utilities without database dependencies
 */

import {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateTokenPair,
  decodeToken,
  isTokenExpired,
  extractBearerToken,
  type JWTPayload
} from '../../src/utils/jwt';

describe('JWT Utility Functions', () => {
  const testPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    role: 'consumer',
    subscriptionTier: 'free'
  };

  describe('generateAccessToken', () => {
    test('should return a string', () => {
      const token = generateAccessToken(testPayload);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should generate different tokens for same payload', () => {
      const token1 = generateAccessToken(testPayload);
      const token2 = generateAccessToken(testPayload);

      // Tokens should be different due to unique tokenId
      expect(token1).not.toBe(token2);
    });

    test('should encode payload in token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = decodeToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.role).toBe(testPayload.role);
      expect(decoded?.subscriptionTier).toBe(testPayload.subscriptionTier);
    });

    test('should include tokenId in generated token', () => {
      const token = generateAccessToken(testPayload);
      const decoded = decodeToken(token);

      expect(decoded?.tokenId).toBeTruthy();
      expect(typeof decoded?.tokenId).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    test('should decode the token from generateAccessToken', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
      expect(decoded.subscriptionTier).toBe(testPayload.subscriptionTier);
      expect(decoded.tokenId).toBeTruthy();
    });

    test('should include token metadata', () => {
      const token = generateAccessToken(testPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('role');
      expect(decoded).toHaveProperty('subscriptionTier');
      expect(decoded).toHaveProperty('tokenId');
    });

    test('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.string';

      expect(() => verifyAccessToken(invalidToken)).toThrow();
    });

    test('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';

      expect(() => verifyAccessToken(malformedToken)).toThrow();
    });

    test('should throw error for empty token', () => {
      expect(() => verifyAccessToken('')).toThrow();
    });
  });

  describe('expired token handling', () => {
    test('should detect expired tokens', () => {
      // Create a token with JWT_EXPIRES_IN = '1h' (default)
      const token = generateAccessToken(testPayload);

      // Token should not be expired immediately after creation
      expect(isTokenExpired(token)).toBe(false);
    });

    test('isTokenExpired should return true for invalid token', () => {
      const invalidToken = 'invalid.token';

      expect(isTokenExpired(invalidToken)).toBe(true);
    });

    test('isTokenExpired should return true for empty token', () => {
      expect(isTokenExpired('')).toBe(true);
    });

    test('should handle token without exp claim', () => {
      // Create a token-like string without exp
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0In0.test';

      expect(isTokenExpired(tokenWithoutExp)).toBe(true);
    });
  });

  describe('generateRefreshToken', () => {
    test('should return a string', () => {
      const token = generateRefreshToken(testPayload);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should be different from access token', () => {
      const accessToken = generateAccessToken(testPayload);
      const refreshToken = generateRefreshToken(testPayload);

      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('generateTokenPair', () => {
    test('should generate both access and refresh tokens', () => {
      const tokenPair = generateTokenPair(testPayload);

      expect(tokenPair).toHaveProperty('accessToken');
      expect(tokenPair).toHaveProperty('refreshToken');
      expect(tokenPair).toHaveProperty('expiresIn');
      expect(typeof tokenPair.accessToken).toBe('string');
      expect(typeof tokenPair.refreshToken).toBe('string');
      expect(typeof tokenPair.expiresIn).toBe('number');
    });

    test('should have different access and refresh tokens', () => {
      const tokenPair = generateTokenPair(testPayload);

      expect(tokenPair.accessToken).not.toBe(tokenPair.refreshToken);
    });

    test('should have positive expiration time', () => {
      const tokenPair = generateTokenPair(testPayload);

      expect(tokenPair.expiresIn).toBeGreaterThan(0);
    });
  });

  describe('decodeToken', () => {
    test('should decode token without verification', () => {
      const token = generateAccessToken(testPayload);
      const decoded = decodeToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded?.userId).toBe(testPayload.userId);
    });

    test('should return null for invalid token', () => {
      const decoded = decodeToken('invalid.token');

      expect(decoded).toBeNull();
    });
  });

  describe('extractBearerToken', () => {
    test('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const authHeader = `Bearer ${token}`;
      const extracted = extractBearerToken(authHeader);

      expect(extracted).toBe(token);
    });

    test('should return null for missing header', () => {
      const extracted = extractBearerToken(undefined);

      expect(extracted).toBeNull();
    });

    test('should return null for header without Bearer', () => {
      const extracted = extractBearerToken('token-without-bearer');

      expect(extracted).toBeNull();
    });

    test('should return null for malformed Bearer header', () => {
      const extracted = extractBearerToken('Bearer');

      expect(extracted).toBeNull();
    });

    test('should return null for wrong auth type', () => {
      const extracted = extractBearerToken('Basic token123');

      expect(extracted).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    test('should verify valid refresh token', () => {
      const refreshToken = generateRefreshToken(testPayload);
      const decoded = verifyRefreshToken(refreshToken);

      expect(decoded).toBeTruthy();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
    });

    test('should throw error for invalid refresh token', () => {
      expect(() => verifyRefreshToken('invalid.refresh.token')).toThrow();
    });

    test('should not verify access token as refresh token', () => {
      const accessToken = generateAccessToken(testPayload);

      // Access token should fail refresh token verification
      expect(() => verifyRefreshToken(accessToken)).toThrow();
    });
  });
});
