import apiClient from './client';
import type { Alert, ApiResponse } from '../types';

export interface AlertFilters {
  type?: 'price_drop' | 'price_increase' | 'back_in_stock' | 'deal' | 'festival' | 'prediction' | 'all';
  read?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateAlertData {
  productId: string;
  type: 'price_drop' | 'price_increase' | 'back_in_stock';
  targetPrice?: number;
  threshold?: number;
  channels?: ('push' | 'email' | 'sms' | 'whatsapp' | 'in_app')[];
}

// Get all alerts
export const getAlerts = async (params?: AlertFilters): Promise<ApiResponse<Alert[]>> => {
  const response = await apiClient.get('/alerts', { params });
  return response.data;
};

// Get single alert
export const getAlert = async (id: string): Promise<ApiResponse<Alert>> => {
  const response = await apiClient.get(`/alerts/${id}`);
  return response.data;
};

// Create new alert
export const createAlert = async (data: CreateAlertData): Promise<ApiResponse<Alert>> => {
  const response = await apiClient.post('/alerts', data);
  return response.data;
};

// Mark alert as read
export const markAsRead = async (id: string): Promise<ApiResponse<Alert>> => {
  const response = await apiClient.patch(`/alerts/${id}/read`);
  return response.data;
};

// Mark all alerts as read
export const markAllAsRead = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.patch('/alerts/read-all');
  return response.data;
};

// Delete alert
export const deleteAlert = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/alerts/${id}`);
  return response.data;
};

// Delete all alerts
export const deleteAllAlerts = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.delete('/alerts/all');
  return response.data;
};

// Get unread count
export const getUnreadCount = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.get('/alerts/unread/count');
  return response.data;
};

// Get recent alerts
export const getRecentAlerts = async (limit: number = 10): Promise<ApiResponse<Alert[]>> => {
  const response = await apiClient.get('/alerts/recent', { params: { limit } });
  return response.data;
};

// Get alerts by type
export const getAlertsByType = async (
  type: Alert['type'],
  params?: Omit<AlertFilters, 'type'>
): Promise<ApiResponse<Alert[]>> => {
  const response = await apiClient.get(`/alerts/type/${type}`, { params });
  return response.data;
};

// Snooze alert
export const snoozeAlert = async (id: string, duration: number): Promise<ApiResponse<Alert>> => {
  const response = await apiClient.patch(`/alerts/${id}/snooze`, { duration });
  return response.data;
};

export const alertsApi = {
  getAlerts,
  getAlert,
  createAlert,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  deleteAllAlerts,
  getUnreadCount,
  getRecentAlerts,
  getAlertsByType,
  snoozeAlert,
};

export default alertsApi;
