import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '../types/index';
import { authApi } from '../api';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'consumer' | 'msme') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,

      // Initialize auth on app load
      initAuth: async () => {
        const token = localStorage.getItem('retailiq-auth-token');
        if (!token) {
          return;
        }

        try {
          set({ isLoading: true });
          const response = await authApi.getProfile();
          set({
            user: response.data,
            isAuthenticated: true,
            token,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('retailiq-auth-token');
          localStorage.removeItem('retailiq-refresh-token');
          set({
            user: null,
            isAuthenticated: false,
            token: null,
            isLoading: false,
          });
        }
      },

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(email, password);
          const { user, token, refreshToken } = response.data;

          // Store tokens
          localStorage.setItem('retailiq-auth-token', token);
          localStorage.setItem('retailiq-refresh-token', refreshToken);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.loginWithGoogle();

          // Redirect to OAuth URL
          if (response.data.authUrl) {
            window.location.href = response.data.authUrl;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Google login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      loginWithFacebook: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.loginWithFacebook();

          // Redirect to OAuth URL
          if (response.data.authUrl) {
            window.location.href = response.data.authUrl;
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Facebook login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      register: async (name: string, email: string, password: string, role: 'consumer' | 'msme' = 'consumer') => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.register(name, email, password, role);
          const { user, token, refreshToken } = response.data;

          // Store tokens
          localStorage.setItem('retailiq-auth-token', token);
          localStorage.setItem('retailiq-refresh-token', refreshToken);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      logout: async () => {
        const token = get().token;

        try {
          if (token) {
            await authApi.logout(token);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens and state regardless of API call success
          localStorage.removeItem('retailiq-auth-token');
          localStorage.removeItem('retailiq-refresh-token');

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authApi.updateProfile(data);

          set({
            user: response.data,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'retailiq-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
