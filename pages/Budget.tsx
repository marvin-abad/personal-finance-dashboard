import React, {useEffect} from 'react';
import {useFinanceStore} from '../hooks/useFinanceStore';
import BudgetCard from '../components/BudgetCard';
import {Spinner} from '../components/ui/Spinner';

const Budget: React.FC = () => {
    const {budgets, loading, fetchBudgets, updateBudget} = useFinanceStore();

    useEffect(() => {
        fetchBudgets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="glassmorphism p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Monthly Budgets</h2>
                <p className="text-slate-300 mb-6">Track your spending against your set limits for each category.</p>
            </div>

            {budgets.length === 0 && !loading && (
                <div className="glassmorphism p-6 rounded-lg shadow-lg text-center">
                    <p className="text-slate-400">No budgets set up yet. Your budgets for the current month will appear
                        here once you add transactions.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((budget) => (
                    <div key={budget.id} className="glassmorphism p-6 rounded-lg shadow-lg space-y-4">
                        <h3 className="text-lg font-semibold text-slate-200">{new Date(budget.year, budget.month).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric'
                        })} Budget</h3>
                        {budget.categories.map((cat) => (
                            <BudgetCard key={cat.name} categoryBudget={cat} onUpdateLimit={() => {
                            }}/>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Budget;