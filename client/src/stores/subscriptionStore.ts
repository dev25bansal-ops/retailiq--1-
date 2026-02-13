import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SubscriptionPlan, SubscriptionTier, Transaction, PaymentMethod } from '../types/index';
import { subscriptionsApi, paymentsApi } from '../api';

interface Subscription {
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

interface UsageStats {
  trackedProducts: { used: number; limit: number };
  alerts: { used: number; limit: number };
  competitors: { used: number; limit: number };
  apiCalls: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
}

interface SubscriptionStore {
  currentSubscription: Subscription | null;
  plans: SubscriptionPlan[];
  usageStats: UsageStats | null;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;

  // Actions
  fetchPlans: () => Promise<void>;
  fetchCurrentSubscription: () => Promise<void>;
  fetchUsageStats: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  fetchTransactionHistory: () => Promise<void>;
  subscribe: (planId: string, billingCycle: 'monthly' | 'yearly', paymentMethod: string, couponCode?: string) => Promise<void>;
  cancelSubscription: (reason?: string) => Promise<void>;
  upgradeSubscription: (planId: string) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSubscription: null,
      plans: [],
      usageStats: null,
      transactions: [],
      paymentMethods: [],
      isLoading: false,
      isProcessing: false,
      error: null,

      // Actions
      fetchPlans: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await subscriptionsApi.getPlans();
          set({
            plans: response.data || [],
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch plans';
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      fetchCurrentSubscription: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await subscriptionsApi.getCurrentSubscription();
          set({
            currentSubscription: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          // User might not have a subscription yet
          if (error.response?.status === 404) {
            set({
              currentSubscription: null,
              isLoading: false,
            });
          } else {
            const errorMessage = error.response?.data?.message || 'Failed to fetch subscription';
            set({
              error: errorMessage,
              isLoading: false,
            });
          }
        }
      },

      fetchUsageStats: async () => {
        try {
          const response = await subscriptionsApi.getUsageStats();
          set({ usageStats: response.data });
        } catch (error: any) {
          console.error('Failed to fetch usage stats:', error);
        }
      },

      fetchPaymentMethods: async () => {
        try {
          const response = await paymentsApi.getPaymentMethods();
          set({ paymentMethods: response.data || [] });
        } catch (error: any) {
          console.error('Failed to fetch payment methods:', error);
        }
      },

      fetchTransactionHistory: async () => {
        try {
          const response = await paymentsApi.getPaymentHistory();
          set({ transactions: response.data?.transactions || [] });
        } catch (error: any) {
          console.error('Failed to fetch transaction history:', error);
        }
      },

      subscribe: async (planId: string, billingCycle: 'monthly' | 'yearly', paymentMethod: string, couponCode?: string) => {
        set({ isProcessing: true, error: null });

        try {
          const response = await subscriptionsApi.subscribe(planId, billingCycle, paymentMethod, couponCode);

          if (response.data?.paymentUrl) {
            // Redirect to payment page
            window.location.href = response.data.paymentUrl;
          } else {
            set({
              currentSubscription: response.data.subscription,
              isProcessing: false,
            });

            // Refresh usage stats
            get().fetchUsageStats();
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Subscription failed';
          set({
            error: errorMessage,
            isProcessing: false,
          });
          throw new Error(errorMessage);
        }
      },

      cancelSubscription: async (reason?: string) => {
        set({ isProcessing: true, error: null });

        try {
          const response = await subscriptionsApi.cancelSubscription(reason);
          set({
            currentSubscription: response.data.subscription,
            isProcessing: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Cancellation failed';
          set({
            error: errorMessage,
            isProcessing: false,
          });
          throw new Error(errorMessage);
        }
      },

      upgradeSubscription: async (planId: string) => {
        set({ isProcessing: true, error: null });

        try {
          const response = await subscriptionsApi.upgradeSubscription(planId);
          set({
            currentSubscription: response.data.subscription,
            isProcessing: false,
          });

          // Refresh usage stats
          get().fetchUsageStats();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Upgrade failed';
          set({
            error: errorMessage,
            isProcessing: false,
          });
          throw new Error(errorMessage);
        }
      },

      addPaymentMethod: async (method: Omit<PaymentMethod, 'id'>) => {
        try {
          const response = await paymentsApi.addPaymentMethod({
            type: method.type,
            last4: method.last4,
            brand: method.brand,
            upiId: method.upiId,
          });

          set((state) => ({
            paymentMethods: [...state.paymentMethods, response.data],
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to add payment method';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      removePaymentMethod: async (id: string) => {
        try {
          await paymentsApi.deletePaymentMethod(id);

          set((state) => ({
            paymentMethods: state.paymentMethods.filter((m) => m.id !== id),
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to remove payment method';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'retailiq-subscription',
      partialize: (state) => ({
        // Don't persist sensitive data like payment methods
        currentSubscription: state.currentSubscription,
      }),
    }
  )
);
