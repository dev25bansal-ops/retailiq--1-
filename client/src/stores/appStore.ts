import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewMode, Language } from '../types/index';

type Theme = 'light' | 'dark' | 'system';

interface AppStore {
  viewMode: ViewMode;
  sidebarOpen: boolean;
  language: Language;
  theme: Theme;
  isOnline: boolean;
  installPromptEvent: any;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setOnline: (status: boolean) => void;
  setInstallPrompt: (event: any) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      viewMode: 'consumer',
      sidebarOpen: true,
      language: 'en',
      theme: 'system',
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      installPromptEvent: null,

      // Actions
      setViewMode: (mode: ViewMode) => {
        set({ viewMode: mode });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setLanguage: (lang: Language) => {
        set({ language: lang });
        
        // Update document language
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
        }
      },

      setTheme: (theme: Theme) => {
        set({ theme });

        // Apply theme to document
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          
          if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', prefersDark);
          } else {
            root.classList.toggle('dark', theme === 'dark');
          }
        }
      },

      setOnline: (status: boolean) => {
        set({ isOnline: status });
      },

      setInstallPrompt: (event: any) => {
        set({ installPromptEvent: event });
      },
    }),
    {
      name: 'retailiq-app',
      partialize: (state) => ({
        viewMode: state.viewMode,
        language: state.language,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Initialize online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    useAppStore.getState().setOnline(false);
  });

  // Listen for theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const { theme } = useAppStore.getState();
    if (theme === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });

  // Listen for PWA install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    useAppStore.getState().setInstallPrompt(e);
  });
}
