import { create } from 'zustand';
import { api } from '../services/api';
import type { User } from '../types';
import type { LoginCredentials, UserUpdateData, RegisterCredentials } from '../services/apiTypes';
import { useCallback } from 'react';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    checkAuthStatus: () => void;
    updateUser: (data: UserUpdateData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('authToken'), // Initialize token from localStorage
    isAuthenticated: !!localStorage.getItem('authToken'),
    loading: true,
    error: null,
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const { user, token } = await api.login(credentials);
            localStorage.setItem('authToken', token);
            set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },
    register: async (credentials: RegisterCredentials) => {
        set({ loading: true, error: null });
        try {
            const { user, token } = await api.register(credentials);
            localStorage.setItem('authToken', token);
            set({ user, token, isAuthenticated: true, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, token: null, isAuthenticated: false });
    },
    checkAuthStatus: () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            set({ token, isAuthenticated: true });
            api.getMe().then(user => {
                set({ user, loading: false });
            }).catch(() => {
                localStorage.removeItem('authToken');
                set({ user: null, token: null, isAuthenticated: false, loading: false });
            });
        } else {
            set({ loading: false, isAuthenticated: false });
        }
    },
    updateUser: async (data: UserUpdateData) => {
        try {
            const updatedUser = await api.updateUser(data);
            set({ user: updatedUser });
        } catch (error) {
            console.error("Failed to update user", error);
            throw error;
        }
    }
}));

export const useCheckAuth = () => {
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
    return useCallback(checkAuthStatus, [checkAuthStatus]);
}