import { create } from 'zustand';
import { User, LoginUserDto, CreateUserDto } from '../types';
import { authApi, userApi } from '../api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginUserDto) => Promise<void>;
  register: (data: CreateUserDto) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (credentials: LoginUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
        isInitialized: true,
      });
      throw error;
    }
  },

  register: async (data: CreateUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed',
        isLoading: false,
        isInitialized: true,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Logout failed',
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userApi.getCurrentUser();
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error: any) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
