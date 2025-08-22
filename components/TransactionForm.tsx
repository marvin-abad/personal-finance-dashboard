

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../constants';
import type { Transaction, TransactionType } from '../types';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

type FormData = {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
};

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormData>();
  
  const selectedType = watch('type', transaction?.type || 'expense');

  useEffect(() => {
    if (transaction) {
      setValue('type', transaction.type);
      setValue('amount', transaction.amount);
      setValue('category', transaction.category);
      setValue('description', transaction.description);
      setValue('date', transaction.date.split('T')[0]);
    } else {
       setValue('date', new Date().toISOString().split('T')[0]);
       setValue('type', 'expense');
    }
  }, [transaction, setValue]);

  const onSubmit = async (data: FormData) => {
    const submissionData = {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date),
    };
    try {
        await onSave(transaction ? { ...transaction, ...submissionData } : submissionData);
        toast.success(`Transaction ${transaction ? 'updated' : 'added'} successfully!`);
        onClose();
    } catch(e) {
        toast.error('An error occurred.');
    }
  };

  const inputClasses = "mt-1 block w-full p-2 border border-slate-600 rounded-md bg-slate-800/50 text-slate-200";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <h2 className="text-xl font-bold text-slate-200">{transaction ? 'Edit' : 'Add'} Transaction</h2>
      <div>
        <label className="block text-sm font-medium text-slate-300">Type</label>
        <select {...register('type')} className={inputClasses}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
       <div>
        <label className="block text-sm font-medium text-slate-300">Amount</label>
        <input type="number" step="0.01" {...register('amount', { required: true, valueAsNumber: true })} className={inputClasses} />
        {errors.amount && <p className="text-red-500 text-sm mt-1">Amount is required.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Category</label>
        <select {...register('category', { required: true })} className={inputClasses}>
          {CATEGORIES.filter(c => selectedType === 'income' ? ['Salary', 'Investment', 'Gifts'].includes(c.name) : !['Salary', 'Investment'].includes(c.name)).map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
         {errors.category && <p className="text-red-500 text-sm mt-1">Category is required.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Description</label>
        <input {...register('description', { required: true })} className={inputClasses} />
         {errors.description && <p className="text-red-500 text-sm mt-1">Description is required.</p>}
      </div>
       <div>
        <label className="block text-sm font-medium text-slate-300">Date</label>
        <input type="date" {...register('date', { required: true })} className={inputClasses + " [color-scheme:dark]"} />
        {errors.date && <p className="text-red-500 text-sm mt-1">Date is required.</p>}
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-700 text-slate-200">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">{isSubmitting ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
};

export default TransactionForm;