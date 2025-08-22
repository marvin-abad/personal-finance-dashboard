import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';

export const formatCurrency = (amount: number, currency = 'PHP') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string, formatStr = 'PPP') => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error("Invalid date string:", dateString);
    return "Invalid Date";
  }
};
