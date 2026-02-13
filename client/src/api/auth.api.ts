import apiClient from './client';
import type { User, UserPreferences, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'consumer' | 'msme';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface OAuthResponse {
  authUrl: string;
}

// Authentication
export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: 'consumer' | 'msme' = 'consumer'
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post('/auth/register', { name, email, password, role });
  return response.data;
};

export const loginWithGoogle = async (): Promise<ApiResponse<OAuthResponse>> => {
  const response = await apiClient.get('/auth/google');
  return response.data;
};

export const loginWithFacebook = async (): Promise<ApiResponse<OAuthResponse>> => {
  const response = await apiClient.get('/auth/facebook');
  return response.data;
};

export const refreshToken = async (token: string): Promise<ApiResponse<{ token: string }>> => {
  const response = await apiClient.post('/auth/refresh', { refreshToken: token });
  return response.data;
};

export const logout = async (token?: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.post('/auth/logout', { token });
  return response.data;
};

export const forgotPassword = async (email: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const verifyEmail = async (token: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/auth/verify-email', { token });
  return response.data;
};

// Profile Management
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await apiClient.patch('/auth/profile', data);
  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Preferences
export const getPreferences = async (): Promise<ApiResponse<UserPreferences>> => {
  const response = await apiClient.get('/auth/preferences');
  return response.data;
};

export const updatePreferences = async (
  preferences: Partial<UserPreferences>
): Promise<ApiResponse<UserPreferences>> => {
  const response = await apiClient.patch('/auth/preferences', preferences);
  return response.data;
};

// Account Deletion
export const deleteAccount = async (): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete('/auth/account');
  return response.data;
};

export const authApi = {
  login,
  register,
  loginWithGoogle,
  loginWithFacebook,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
  getPreferences,
  updatePreferences,
  deleteAccount,
};

export default authApi;
