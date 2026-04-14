/**
 * Get the first day of a given month/year
 */
const getMonthStart = (month, year) => new Date(year, month - 1, 1);

/**
 * Get the last day of a given month/year
 */
const getMonthEnd = (month, year) => new Date(year, month, 0, 23, 59, 59);

/**
 * Format currency in INR
 */
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

/**
 * Get current month and year
 */
const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

/**
 * Calculate balance due
 */
const calculateBalance = (amountDue, amountPaid) => Math.max(0, amountDue - amountPaid);

/**
 * Paginate results
 */
const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

module.exports = {
  getMonthStart,
  getMonthEnd,
  formatCurrency,
  getCurrentMonthYear,
  calculateBalance,
  paginate,
};
