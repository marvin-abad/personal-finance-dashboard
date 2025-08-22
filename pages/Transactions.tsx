import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { TransactionList } from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import { Modal } from '../components/ui/Modal';
import { PlusCircle, Filter } from 'lucide-react';
import type { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { Spinner } from '../components/ui/Spinner';
import { Pagination } from '../components/Pagination';

const Transactions: React.FC = () => {
  const { transactions, pagination, loading, fetchTransactions, addTransaction, updateTransaction, deleteTransaction } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<{ type: TransactionType | '', category: string }>({ type: '', category: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTransactions({ ...filters, page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const handleOpenModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glassmorphism p-4 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-slate-400 hidden sm:block" />
          <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border border-slate-600 rounded-md w-full sm:w-auto bg-slate-800/50 text-slate-200">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="p-2 border border-slate-600 rounded-md w-full sm:w-auto bg-slate-800/50 text-slate-200">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <PlusCircle size={20} />
          <span>Add Transaction</span>
        </button>
      </div>
      
      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="glassmorphism p-6 rounded-lg shadow-lg">
          <TransactionList transactions={transactions} onEdit={handleOpenModal} onDelete={deleteTransaction} />
           <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setCurrentPage}
           />
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <TransactionForm
            transaction={editingTransaction}
            onSave={editingTransaction ? updateTransaction : addTransaction}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Transactions;
