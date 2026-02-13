import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, NotificationPreferences } from '../types/index';
import { notificationsApi } from '../api';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  isPermissionGranted: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: (filters?: any) => Promise<void>;
  addNotificationFromSSE: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  clearAll: () => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      preferences: {
        email: true,
        push: true,
        sms: false,
        whatsapp: false,
        priceDropThreshold: 10,
        frequency: 'instant',
      },
      isPermissionGranted: false,
      isLoading: false,
      error: null,

      // Actions
      fetchNotifications: async (filters?: any) => {
        set({ isLoading: true, error: null });

        try {
          const [notificationsRes, unreadRes] = await Promise.all([
            notificationsApi.getNotifications(filters),
            notificationsApi.getUnreadCount(),
          ]);

          set({
            notifications: notificationsRes.data || [],
            unreadCount: unreadRes.data?.count || 0,
            isLoading: false,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch notifications';
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      addNotificationFromSSE: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: !notification.read ? state.unreadCount + 1 : state.unreadCount,
        }));

        // Show browser notification if permission granted
        if (get().isPermissionGranted && get().preferences.push) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.body,
              icon: notification.icon || '/logo192.png',
            });
          }
        }
      },

      markAsRead: async (id: string) => {
        try {
          await notificationsApi.markNotificationRead(id);

          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (!notification || notification.read) {
              return state;
            }

            return {
              notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
              unreadCount: Math.max(0, state.unreadCount - 1),
            };
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to mark as read';
          set({ error: errorMessage });
        }
      },

      markAllAsRead: async () => {
        try {
          await notificationsApi.markAllNotificationsRead();

          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to mark all as read';
          set({ error: errorMessage });
        }
      },

      deleteNotification: async (id: string) => {
        try {
          await notificationsApi.deleteNotification(id);

          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.read;

            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
            };
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to delete notification';
          set({ error: errorMessage });
        }
      },

      updatePreferences: async (prefs: Partial<NotificationPreferences>) => {
        try {
          const response = await notificationsApi.updatePreferences(prefs);
          set({ preferences: response.data });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update preferences';
          set({ error: errorMessage });
        }
      },

      requestPermission: async () => {
        if (!('Notification' in window)) {
          console.warn('This browser does not support notifications');
          return false;
        }

        try {
          const permission = await Notification.requestPermission();
          const granted = permission === 'granted';
          set({ isPermissionGranted: granted });
          return granted;
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          return false;
        }
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'retailiq-notifications',
      partialize: (state) => ({
        preferences: state.preferences,
        isPermissionGranted: state.isPermissionGranted,
      }),
    }
  )
);
