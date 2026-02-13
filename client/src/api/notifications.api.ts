import apiClient from './client';
import type { Notification, NotificationPreferences, ApiResponse } from '../types';

export interface NotificationFilters {
  type?: 'alert' | 'system' | 'promo' | 'social' | 'achievement' | 'all';
  read?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Get all notifications
export const getNotifications = async (params?: NotificationFilters): Promise<ApiResponse<Notification[]>> => {
  const response = await apiClient.get('/notifications', { params });
  return response.data;
};

// Get single notification
export const getNotification = async (id: string): Promise<ApiResponse<Notification>> => {
  const response = await apiClient.get(`/notifications/${id}`);
  return response.data;
};

// Mark notification as read
export const markNotificationRead = async (id: string): Promise<ApiResponse<Notification>> => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsRead = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data;
};

// Delete notification
export const deleteNotification = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};

// Delete all notifications
export const deleteAllNotifications = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.delete('/notifications/all');
  return response.data;
};

// Get unread count
export const getUnreadCount = async (): Promise<ApiResponse<{ count: number }>> => {
  const response = await apiClient.get('/notifications/unread/count');
  return response.data;
};

// Get recent notifications
export const getRecentNotifications = async (limit: number = 10): Promise<ApiResponse<Notification[]>> => {
  const response = await apiClient.get('/notifications/recent', { params: { limit } });
  return response.data;
};

// Get notification preferences
export const getPreferences = async (): Promise<ApiResponse<NotificationPreferences>> => {
  const response = await apiClient.get('/notifications/preferences');
  return response.data;
};

// Update notification preferences
export const updatePreferences = async (
  preferences: Partial<NotificationPreferences>
): Promise<ApiResponse<NotificationPreferences>> => {
  const response = await apiClient.patch('/notifications/preferences', preferences);
  return response.data;
};

// Test notification
export const testNotification = async (
  channel: 'email' | 'push' | 'sms' | 'whatsapp'
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/notifications/test', { channel });
  return response.data;
};

// Register device for push notifications
export const registerDevice = async (data: {
  token: string;
  platform: 'web' | 'ios' | 'android';
}): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/notifications/register-device', data);
  return response.data;
};

// Unregister device
export const unregisterDevice = async (token: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/notifications/unregister-device', { token });
  return response.data;
};

export const notificationsApi = {
  getNotifications,
  getNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  getRecentNotifications,
  getPreferences,
  updatePreferences,
  testNotification,
  registerDevice,
  unregisterDevice,
};

export default notificationsApi;
