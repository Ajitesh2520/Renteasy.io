const RENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
  WAIVED: 'waived',
};

const PAYMENT_METHOD = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  UPI: 'upi',
  CHEQUE: 'cheque',
  OTHER: 'other',
};

const REMINDER_TYPE = {
  SMS: 'sms',
  EMAIL: 'email',
  BOTH: 'both',
};

module.exports = { RENT_STATUS, PAYMENT_METHOD, REMINDER_TYPE };
