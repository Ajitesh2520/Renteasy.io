const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tenant name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    unit: {
      type: String,
      required: [true, 'Unit/flat number is required'],
      trim: true,
    },
    property: {
      type: String,
      trim: true,
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent amount is required'],
      min: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    leaseStart: {
      type: Date,
      required: [true, 'Lease start date is required'],
    },
    leaseEnd: {
      type: Date,
    },
    rentDueDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 28,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);
