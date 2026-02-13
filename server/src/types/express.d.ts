import { JWTPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      tier?: string;
      tierLimits?: {
        maxProducts: number;
        maxTransactionsPerMonth: number;
        maxUsers: number;
        aiFeatures: boolean;
        priceForecasting: boolean;
        advancedReports: boolean;
        apiAccess: boolean;
        support: string;
      };
    }
  }
}

export {};
