const Payment = require('../models/Payment');
const RentCycle = require('../models/RentCycle');
const { RENT_STATUS } = require('../constants/rentStatus');
const path = require('path');

const recordPayment = async ({ tenant, rentCycle, amount, method, paidAt, transactionId, notes, recordedBy, receiptFile }) => {
  const cycle = await RentCycle.findById(rentCycle);
  if (!cycle) throw new Error('Rent cycle not found');

  let receiptUrl;
  if (receiptFile) {
    receiptUrl = `/uploads/receipts/${receiptFile.filename}`;
  }

  const payment = await Payment.create({
    tenant,
    rentCycle,
    amount,
    method,
    paidAt: paidAt || new Date(),
    transactionId,
    notes,
    recordedBy,
    receiptUrl,
  });

  // Update rent cycle
  const newAmountPaid = cycle.amountPaid + Number(amount);
  let newStatus;
  if (newAmountPaid >= cycle.amountDue) {
    newStatus = RENT_STATUS.PAID;
  } else if (newAmountPaid > 0) {
    newStatus = RENT_STATUS.PARTIAL;
  } else {
    newStatus = cycle.status;
  }

  await RentCycle.findByIdAndUpdate(rentCycle, {
    amountPaid: newAmountPaid,
    status: newStatus,
  });

  return payment;
};

module.exports = { recordPayment };
