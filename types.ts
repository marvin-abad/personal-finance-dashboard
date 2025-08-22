
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currency: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
}

export interface BudgetCategory {
  name: string;
  limit: number;
  spent: number;
}

export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  categories: BudgetCategory[];
  totalLimit: number;
  totalSpent: number;
}
