import mongoose from 'mongoose';

const budgetCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    limit: { type: Number, required: true, default: 0 }
});

const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true }, // 0-11
    year: { type: Number, required: true },
    categories: [budgetCategorySchema]
}, { timestamps: true });

// Ensure a user can only have one budget document per month/year
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
