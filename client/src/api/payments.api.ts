import apiClient from './client';
import type { Transaction, PaymentMethod, Currency, ApiResponse } from '../types';

export interface CreateOrderData {
  amount: number;
  currency?: Currency;
  description?: string;
  subscriptionId?: string;
  metadata?: Record<string, any>;
}

export interface VerifyPaymentData {
  orderId: string;
  paymentId: string;
  signature: string;
  provider: 'razorpay' | 'stripe' | 'paypal';
}

export interface PaymentHistory {
  transactions: Transaction[];
  totalSpent: number;
  currency: Currency;
}

export interface PromoCodeResponse {
  valid: boolean;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount: number;
  expiresAt?: string;
}

// Create payment order
export const createOrder = async (
  amount: number,
  data?: Omit<CreateOrderData, 'amount'>
): Promise<
  ApiResponse<{
    orderId: string;
    amount: number;
    currency: Currency;
    key?: string;
    secret?: string;
  }>
> => {
  const response = await apiClient.post('/payments/orders', { amount, ...data });
  return response.data;
};

// Verify payment
export const verifyPayment = async (
  data: VerifyPaymentData
): Promise<ApiResponse<{ verified: boolean; transaction: Transaction }>> => {
  const response = await apiClient.post('/payments/verify', data);
  return response.data;
};

// Get payment history
export const getPaymentHistory = async (params?: {
  startDate?: string;
  endDate?: string;
  status?: Transaction['status'];
  type?: Transaction['type'];
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PaymentHistory>> => {
  const response = await apiClient.get('/payments/history', { params });
  return response.data;
};

// Get single transaction
export const getTransaction = async (id: string): Promise<ApiResponse<Transaction>> => {
  const response = await apiClient.get(`/payments/transactions/${id}`);
  return response.data;
};

// Apply promo code
export const applyPromo = async (
  code: string,
  amount: number
): Promise<ApiResponse<PromoCodeResponse>> => {
  const response = await apiClient.post('/payments/promo/apply', { code, amount });
  return response.data;
};

// Validate promo code
export const validatePromo = async (code: string): Promise<ApiResponse<PromoCodeResponse>> => {
  const response = await apiClient.post('/payments/promo/validate', { code });
  return response.data;
};

// Get payment methods
export const getPaymentMethods = async (): Promise<ApiResponse<PaymentMethod[]>> => {
  const response = await apiClient.get('/payments/methods');
  return response.data;
};

// Add payment method
export const addPaymentMethod = async (data: {
  type: PaymentMethod['type'];
  token?: string;
  upiId?: string;
  cardDetails?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvv: string;
  };
}): Promise<ApiResponse<PaymentMethod>> => {
  const response = await apiClient.post('/payments/methods', data);
  return response.data;
};

// Delete payment method
export const deletePaymentMethod = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/payments/methods/${id}`);
  return response.data;
};

// Set default payment method
export const setDefaultPaymentMethod = async (id: string): Promise<ApiResponse<PaymentMethod>> => {
  const response = await apiClient.patch(`/payments/methods/${id}/default`);
  return response.data;
};

// Request refund
export const requestRefund = async (
  transactionId: string,
  reason: string,
  amount?: number
): Promise<ApiResponse<{ refundId: string; status: string; amount: number }>> => {
  const response = await apiClient.post('/payments/refunds', {
    transactionId,
    reason,
    amount,
  });
  return response.data;
};

// Get refund status
export const getRefundStatus = async (
  refundId: string
): Promise<ApiResponse<{ status: string; amount: number; processedAt?: string }>> => {
  const response = await apiClient.get(`/payments/refunds/${refundId}`);
  return response.data;
};

// Get invoice
export const getInvoice = async (
  transactionId: string
): Promise<ApiResponse<{ invoiceUrl: string; invoiceNumber: string }>> => {
  const response = await apiClient.get(`/payments/invoices/${transactionId}`);
  return response.data;
};

// Download invoice
export const downloadInvoice = async (transactionId: string): Promise<Blob> => {
  const response = await apiClient.get(`/payments/invoices/${transactionId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

// Get payment stats
export const getPaymentStats = async (): Promise<
  ApiResponse<{
    totalSpent: number;
    totalTransactions: number;
    successRate: number;
    lastPayment?: Transaction;
  }>
> => {
  const response = await apiClient.get('/payments/stats');
  return response.data;
};

// Process webhook (internal use)
export const processWebhook = async (
  provider: string,
  payload: any
): Promise<ApiResponse<{ processed: boolean }>> => {
  const response = await apiClient.post('/payments/webhooks', { provider, payload });
  return response.data;
};

export const paymentsApi = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getTransaction,
  applyPromo,
  validatePromo,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  requestRefund,
  getRefundStatus,
  getInvoice,
  downloadInvoice,
  getPaymentStats,
  processWebhook,
};

export default paymentsApi;
