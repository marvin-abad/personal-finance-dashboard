import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getStats } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, createTransaction);
router.get('/stats', protect, getStats);
router.route('/:id').put(protect, updateTransaction).delete(protect, deleteTransaction);

export default router;
