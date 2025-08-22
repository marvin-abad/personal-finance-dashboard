import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    const { type, category, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.user._id };
    if (type) query.type = type;
    if (category) query.category = category;
    
    try {
        const count = await Transaction.countDocuments(query);
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        
        res.json({
            items: transactions,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
    const { type, amount, category, description, date } = req.body;
    
    const transaction = new Transaction({
        user: req.user._id,
        type,
        amount,
        category,
        description,
        date
    });
    
    try {
        const createdTransaction = await transaction.save();
        res.status(201).json(createdTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'No transaction with that id' });
    }
    
    const transaction = await Transaction.findById(id);

    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    transaction.type = type;
    transaction.amount = amount;
    transaction.category = category;
    transaction.description = description;
    transaction.date = date;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'No transaction with that id' });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();

    res.json({ message: 'Transaction removed' });
};

// @desc    Get financial stats for the dashboard
// @route   GET /api/transactions/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlyTransactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });
        
        const allTransactions = await Transaction.find({ user: req.user._id });

        const totalIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = allTransactions.reduce((sum, t) => {
            return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);
        
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
        
        const monthlySpendingByCategory = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        const monthlySpending = Object.entries(monthlySpendingByCategory).map(([name, value]) => ({ name, value: value }));
        
        res.json({ totalIncome, totalExpenses, balance, savingsRate, monthlySpending });
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

export { getTransactions, createTransaction, updateTransaction, deleteTransaction, getStats };
