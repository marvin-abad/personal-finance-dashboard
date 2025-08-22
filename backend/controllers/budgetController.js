import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc    Get or create budget for the current month
// @route   GET /api/budgets
// @access  Private
const getCurrentMonthBudget = async (req, res) => {
    try {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        let budget = await Budget.findOne({ user: req.user._id, month, year });

        // If no budget, create a default one
        if (!budget) {
            budget = new Budget({
                user: req.user._id,
                month,
                year,
                categories: [
                    { name: 'Groceries', limit: 400 },
                    { name: 'Transport', limit: 150 },
                    { name: 'Housing', limit: 1200 },
                    { name: 'Food', limit: 300 },
                    { name: 'Entertainment', limit: 200 },
                ]
            });
            await budget.save();
        }

        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        const expenses = await Transaction.find({
            user: req.user._id,
            type: 'expense',
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const spentByCategory = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const budgetWithSpent = budget.categories.map(cat => ({
            name: cat.name,
            limit: cat.limit,
            spent: spentByCategory[cat.name] || 0,
        }));
        
        const response = {
            id: budget._id,
            userId: budget.user,
            month: budget.month,
            year: budget.year,
            categories: budgetWithSpent,
            totalLimit: budget.categories.reduce((sum, cat) => sum + cat.limit, 0),
            totalSpent: Object.values(spentByCategory).reduce((sum, spent) => sum + (spent || 0), 0)
        };

        res.json([response]); // Return as an array to match frontend structure
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update budget limits
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
    const { categories } = req.body;
    
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        categories.forEach(updatedCat => {
            const existingCat = budget.categories.find(c => c.name === updatedCat.name);
            if (existingCat) {
                existingCat.limit = updatedCat.limit;
            } else {
                budget.categories.push({ name: updatedCat.name, limit: updatedCat.limit });
            }
        });

        const updatedBudget = await budget.save();
        res.json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { getCurrentMonthBudget, updateBudget };
