import { useAuthStore } from '../hooks/useAuthStore';
import type { User, Transaction, Budget, TransactionType } from '../types';
import type { LoginCredentials, UserUpdateData, RegisterCredentials } from './apiTypes';

// In a real Vite app, this would be `import.meta.env.VITE_API_URL`
const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = useAuthStore.getState().token;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        throw new Error(error);
    }
    return data;
};

export const api = {
    login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await handleResponse(response);
        // Map backend _id to frontend id
        return { user: { ...data, id: data.id }, token: data.token };
    },

    register: async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await handleResponse(response);
        return { user: { ...data, id: data.id }, token: data.token };
    },

    getMe: async (): Promise<User> => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getAuthHeader(),
        });
        const data = await handleResponse(response);
        return { ...data, id: data.id };
    },

    updateUser: async (data: UserUpdateData): Promise<User> => {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const fetchedData = await handleResponse(response);
        return { ...fetchedData, id: fetchedData.id };
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/transactions/stats`, {
            headers: getAuthHeader()
        });
        return handleResponse(response);
    },

    getTransactions: async (filters: { type?: TransactionType | '', category?: string, page?: number, limit?: number } = {}) => {
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.category) params.append('category', filters.category);
        if (filters.page) params.append('page', filters.page.toString());

        // Default limit
        const limit = filters.limit || 10;
        params.append('limit', limit.toString());

        const response = await fetch(`${API_URL}/transactions?${params.toString()}`, {
            headers: getAuthHeader(),
        });
        const data = await handleResponse(response);
        // map _id to id
        data.items = data.items.map((item: any) => ({ ...item, id: item._id }));
        return data;
    },

    getBudgets: async (): Promise<Budget[]> => {
        const response = await fetch(`${API_URL}/budgets`, { headers: getAuthHeader() });
        const data = await handleResponse(response);
        // map _id to id
        return data.map((item: any) => ({ ...item, id: item._id }));
    },

    createTransaction: async (data: Omit<Transaction, 'id' | 'userId'>): Promise<Transaction> => {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const created = await handleResponse(response);
        return { ...created, id: created._id };
    },

    updateTransaction: async (data: Transaction): Promise<Transaction> => {
        const response = await fetch(`${API_URL}/transactions/${data.id}`, {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const updated = await handleResponse(response);
        return { ...updated, id: updated._id };
    },

    deleteTransaction: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        await handleResponse(response);
    },

    updateBudget: async(budget: Budget): Promise<Budget> => {
        const response = await fetch(`${API_URL}/budgets/${budget.id}`, {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ categories: budget.categories }) // Only send what's needed
        });
        const updated = await handleResponse(response);
        return { ...updated, id: updated._id };
    }
};