import apiClient from './client';
import type { SubscriptionPlan, SubscriptionTier, ApiResponse } from '../types';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: string;
  billingCycle: 'monthly' | 'yearly';
}

export interface SubscribeData {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  paymentMethod: string;
  couponCode?: string;
}

export interface UsageStats {
  trackedProducts: { used: number; limit: number };
  alerts: { used: number; limit: number };
  competitors: { used: number; limit: number };
  apiCalls: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
}

// Get all available plans
export const getPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  const response = await apiClient.get('/subscriptions/plans');
  return response.data;
};

// Get single plan
export const getPlan = async (id: string): Promise<ApiResponse<SubscriptionPlan>> => {
  const response = await apiClient.get(`/subscriptions/plans/${id}`);
  return response.data;
};

// Get current user subscription
export const getCurrentSubscription = async (): Promise<ApiResponse<Subscription>> => {
  const response = await apiClient.get('/subscriptions/current');
  return response.data;
};

// Subscribe to a plan
export const subscribe = async (
  planId: string,
  billingCycle: 'monthly' | 'yearly',
  paymentMethod: string,
  couponCode?: string
): Promise<ApiResponse<{ subscription: Subscription; paymentUrl?: string }>> => {
  const response = await apiClient.post('/subscriptions/subscribe', {
    planId,
    billingCycle,
    paymentMethod,
    couponCode,
  });
  return response.data;
};

// Update subscription
export const updateSubscription = async (data: {
  planId?: string;
  billingCycle?: 'monthly' | 'yearly';
  autoRenew?: boolean;
}): Promise<ApiResponse<Subscription>> => {
  const response = await apiClient.patch('/subscriptions/current', data);
  return response.data;
};

// Cancel subscription
export const cancelSubscription = async (
  reason?: string
): Promise<ApiResponse<{ subscription: Subscription; message: string }>> => {
  const response = await apiClient.post('/subscriptions/cancel', { reason });
  return response.data;
};

// Reactivate subscription
export const reactivateSubscription = async (): Promise<ApiResponse<Subscription>> => {
  const response = await apiClient.post('/subscriptions/reactivate');
  return response.data;
};

// Get subscription history
export const getSubscriptionHistory = async (): Promise<
  ApiResponse<
    Array<{
      id: string;
      plan: SubscriptionPlan;
      startDate: string;
      endDate: string;
      status: string;
      amount: number;
    }>
  >
> => {
  const response = await apiClient.get('/subscriptions/history');
  return response.data;
};

// Get usage statistics
export const getUsageStats = async (): Promise<ApiResponse<UsageStats>> => {
  const response = await apiClient.get('/subscriptions/usage');
  return response.data;
};

// Validate coupon code
export const validateCoupon = async (
  code: string,
  planId?: string
): Promise<
  ApiResponse<{
    valid: boolean;
    discountPercent?: number;
    discountAmount?: number;
    expiresAt?: string;
  }>
> => {
  const response = await apiClient.post('/subscriptions/validate-coupon', { code, planId });
  return response.data;
};

// Compare plans
export const comparePlans = async (): Promise<
  ApiResponse<{
    plans: SubscriptionPlan[];
    comparison: Record<string, any>;
    recommended: string;
  }>
> => {
  const response = await apiClient.get('/subscriptions/compare');
  return response.data;
};

// Upgrade subscription
export const upgradeSubscription = async (
  planId: string,
  immediate?: boolean
): Promise<ApiResponse<{ subscription: Subscription; proratedAmount?: number }>> => {
  const response = await apiClient.post('/subscriptions/upgrade', { planId, immediate });
  return response.data;
};

// Downgrade subscription
export const downgradeSubscription = async (
  planId: string
): Promise<ApiResponse<{ subscription: Subscription; effectiveDate: string }>> => {
  const response = await apiClient.post('/subscriptions/downgrade', { planId });
  return response.data;
};

// Get billing portal URL (for Stripe/Razorpay)
export const getBillingPortalUrl = async (): Promise<ApiResponse<{ url: string }>> => {
  const response = await apiClient.get('/subscriptions/billing-portal');
  return response.data;
};

export const subscriptionsApi = {
  getPlans,
  getPlan,
  getCurrentSubscription,
  subscribe,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  getSubscriptionHistory,
  getUsageStats,
  validateCoupon,
  comparePlans,
  upgradeSubscription,
  downgradeSubscription,
  getBillingPortalUrl,
};

export default subscriptionsApi;
