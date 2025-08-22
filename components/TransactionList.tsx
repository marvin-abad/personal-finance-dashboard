import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { getCategoryIcon } from '../constants';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  isMinimal?: boolean;
}

const TransactionItem: React.FC<{ transaction: Transaction; onEdit?: (transaction: Transaction) => void; onDelete?: (id: string) => void, isMinimal?: boolean }> = ({ transaction, onEdit, onDelete, isMinimal }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-400' : 'text-red-400';
  const Icon = getCategoryIcon(transaction.category);

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 ${!isMinimal && "border-b border-slate-700/50"}`}>
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <Icon className={`w-5 h-5 ${isIncome ? 'text-green-400' : 'text-red-400'}`} />
        </div>
        <div>
          <p className="font-medium text-slate-200">{transaction.description}</p>
          <p className="text-sm text-slate-400">{transaction.category} &bull; {formatDate(transaction.date, 'PP')}</p>
        </div>
      </div>
      <div className="flex items-center self-end sm:self-center space-x-4 mt-2 sm:mt-0">
        <span className={`font-bold ${amountColor}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
        {!isMinimal && onEdit && onDelete && (
            <>
                <button onClick={() => onEdit(transaction)} className="text-slate-400 hover:text-blue-400">
                    <Edit2 size={18} />
                </button>
                <button onClick={() => window.confirm('Are you sure?') && onDelete(transaction.id)} className="text-slate-400 hover:text-red-400">
                    <Trash2 size={18} />
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, isMinimal = false }) => {
  if (transactions.length === 0) {
    return <p className="text-center text-slate-400 py-4">No transactions found.</p>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} isMinimal={isMinimal} />
      ))}
    </div>
  );
};