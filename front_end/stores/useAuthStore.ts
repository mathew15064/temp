// front_end/stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, setTokens, clearTokens } from '@/lib/axios';

export interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string, isRefreshLogin?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        });
      },

      login: async (email: string, password: string, isRefreshLogin: boolean = true) => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.post('/trpc/auth.login', {
            email,
            password,
            isRefreshLogin,
          });

          const { user, accessToken, refreshToken } = response.data.result.data;

          // Lưu tokens nếu có refresh token
          if (isRefreshLogin && refreshToken) {
            setTokens(accessToken, refreshToken);
          } else {
            // Chỉ lưu access token nếu không yêu cầu refresh token
            setTokens(accessToken, '');
          }

          // Cập nhật user state
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Gọi API logout nếu có
          await apiClient.post('/trpc/auth.logout').catch(() => {});
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear tokens và user state
          clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      refreshUser: async () => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.get('/trpc/auth.me');
          const user = response.data.result.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          const response = await apiClient.get('/trpc/auth.me');
          const user = response.data.result.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);