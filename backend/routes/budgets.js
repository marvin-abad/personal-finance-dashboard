import express from 'express';
import { getCurrentMonthBudget, updateBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCurrentMonthBudget);
router.put('/:id', protect, updateBudget);

export default router;
