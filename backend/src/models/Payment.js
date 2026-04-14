const mongoose = require('mongoose');
const { PAYMENT_METHOD } = require('../constants/rentStatus');

const paymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    rentCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RentCycle',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 1,
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.CASH,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    receiptUrl: {
      type: String,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
