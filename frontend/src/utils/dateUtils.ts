import { format, isAfter, isBefore, parseISO } from 'date-fns';

export const formatDate = (date: string | Date, fmt = 'dd MMM yyyy') =>
  format(typeof date === 'string' ? parseISO(date) : date, fmt);

export const formatMonthYear = (month: number, year: number) =>
  format(new Date(year, month - 1, 1), 'MMMM yyyy');

export const isOverdue = (dueDate: string) => isAfter(new Date(), parseISO(dueDate));

export const isDueSoon = (dueDate: string, days = 3) => {
  const due = parseISO(dueDate);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  return isBefore(due, threshold) && isAfter(due, new Date());
};

export const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export const monthName = (month: number) =>
  new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
