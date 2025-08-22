
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ShoppingCart, Car, Home, Utensils, Shirt, HeartPulse, GraduationCap, Gift, Dices, Plane, HandCoins, Landmark, PiggyBank } from 'lucide-react';

export const CATEGORIES: { name: string; icon: LucideIcon }[] = [
    { name: 'Groceries', icon: ShoppingCart },
    { name: 'Transport', icon: Car },
    { name: 'Housing', icon: Home },
    { name: 'Food', icon: Utensils },
    { name: 'Clothing', icon: Shirt },
    { name: 'Health', icon: HeartPulse },
    { name: 'Education', icon: GraduationCap },
    { name: 'Gifts', icon: Gift },
    { name: 'Entertainment', icon: Dices },
    { name: 'Travel', icon: Plane },
    { name: 'Salary', icon: HandCoins },
    { name: 'Investment', icon: Landmark },
    { name: 'Savings', icon: PiggyBank },
];

export const getCategoryIcon = (categoryName: string): LucideIcon => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category ? category.icon : Dices;
};
