import { create } from 'zustand';
import { api } from '../services/api';
import type { Transaction, Budget, TransactionType } from '../types';

interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  monthlySpending: { name: string; value: number }[];
}

interface PaginationState {
  total: number;
  page: number;
  pages: number;
}

interface FinanceState {
  transactions: Transaction[];
  pagination: PaginationState;
  budgets: Budget[];
  stats: FinanceStats;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  fetchTransactions: (filters: { type?: TransactionType | '', category?: string, page?: number, limit?: number }) => Promise<void>;
  fetchBudgets: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'date'> & { date: Date }) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  pagination: { total: 0, page: 1, pages: 1 },
  budgets: [],
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
    monthlySpending: [],
  },
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const [stats, transactionsData, budgets] = await Promise.all([
        api.getStats(),
        api.getTransactions({ limit: 5, page: 1 }), // recent transactions
        api.getBudgets()
      ]);
      set({ stats, transactions: transactionsData.items, budgets, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },
  
  fetchTransactions: async (filters) => {
    set({ loading: true, error: null });
    try {
      const { items, total, page, pages } = await api.getTransactions({ ...filters });
      set({ 
        transactions: items, 
        pagination: { total, page, pages },
        loading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchBudgets: async () => {
    set({ loading: true, error: null });
    try {
      const budgets = await api.getBudgets();
      set({ budgets, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      await api.createTransaction({
        ...transaction,
        date: transaction.date.toISOString(),
      });
      // Refetch current page of transactions and dashboard stats
      const { page } = get().pagination;
      get().fetchTransactions({ page });
      get().fetchDashboardData(); 
    } catch (error) {
       console.error("Failed to add transaction", error);
       throw error;
    }
  },

  updateTransaction: async (transaction) => {
    try {
      const updatedTransaction = await api.updateTransaction(transaction);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        ),
      }));
       get().fetchDashboardData(); // Refresh stats
    } catch (error) {
      console.error("Failed to update transaction", error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      await api.deleteTransaction(id);
      // Refetch to keep pagination and data correct
      const { page } = get().pagination;
      get().fetchTransactions({ page });
      get().fetchDashboardData(); 
    } catch (error) {
      console.error("Failed to delete transaction", error);
      throw error;
    }
  },

  updateBudget: async(budget) => {
     try {
      const updatedBudget = await api.updateBudget(budget);
      set((state) => ({
        budgets: state.budgets.map((b) =>
          b.id === updatedBudget.id ? updatedBudget : b
        ),
      }));
    } catch (error) {
      console.error("Failed to update budget", error);
      throw error;
    }
  }
}));