

import React, { useEffect } from 'react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import { formatCurrency } from '../utils/helpers';
import { Banknote, ArrowUp, ArrowDown, PiggyBank } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Chart } from '../components/Chart';
import { TransactionList } from '../components/TransactionList';
import { Spinner } from '../components/ui/Spinner';

const Dashboard: React.FC = () => {
  const { stats, transactions, loading, fetchDashboardData } = useFinanceStore();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Banknote}
          label="Total Balance"
          value={formatCurrency(stats.balance)}
          color="text-blue-400"
        />
        <StatCard
          icon={ArrowUp}
          label="Monthly Income"
          value={formatCurrency(stats.totalIncome)}
          color="text-green-400"
        />
        <StatCard
          icon={ArrowDown}
          label="Monthly Expenses"
          value={formatCurrency(stats.totalExpenses)}
          color="text-red-400"
        />
        <StatCard
          icon={PiggyBank}
          label="Savings Rate"
          value={`${stats.savingsRate.toFixed(2)}%`}
          color="text-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glassmorphism p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Monthly Spending</h3>
          <Chart data={stats.monthlySpending} />
        </div>
        <div className="glassmorphism p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Transactions</h3>
          <TransactionList transactions={transactions} isMinimal={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;