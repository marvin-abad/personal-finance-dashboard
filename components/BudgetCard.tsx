

import React from 'react';
import type { BudgetCategory } from '../types';
import { formatCurrency } from '../utils/helpers';
import { getCategoryIcon } from '../constants';

interface BudgetCardProps {
  categoryBudget: BudgetCategory;
  onUpdateLimit: (category: string, newLimit: number) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ categoryBudget }) => {
  const { name, limit, spent } = categoryBudget;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;

  let progressBarColor = 'bg-green-500';
  if (percentage > 75) progressBarColor = 'bg-yellow-500';
  if (percentage >= 100) progressBarColor = 'bg-red-500';

  const Icon = getCategoryIcon(name);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-slate-300"/>
            <span className="font-medium text-slate-200">{name}</span>
        </div>
        <span className="text-sm text-slate-300">{formatCurrency(spent)} / {formatCurrency(limit)}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${progressBarColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-1 text-sm">
        <span className="text-slate-400">{percentage.toFixed(0)}% Spent</span>
        <span className={`${remaining < 0 ? 'text-red-400' : 'text-slate-400'}`}>
          {formatCurrency(remaining)} {remaining >= 0 ? 'left' : 'over'}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;