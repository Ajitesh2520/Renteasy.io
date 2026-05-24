const { payments } = require('../models/localDb');
const { v4: uuidv4 } = require('uuid');

const recordPayment = (req, res, next) => {
  try {
    const payment = {
      ...req.body,
      _id: uuidv4(),
      recordedBy: req.user._id,
      paidAt: req.body.paidAt || new Date(),
      receiptUrl: req.file ? `/uploads/receipts/${req.file.filename}` : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    payments.push(payment);
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

const getPayments = (req, res, next) => {
  try {
    const { tenantId, rentCycleId, page = 1, limit = 20 } = req.query;
    let filtered = payments;
    if (tenantId) filtered = filtered.filter(p => p.tenant === tenantId);
    if (rentCycleId) filtered = filtered.filter(p => p.rentCycle === rentCycleId);
    const paginated = filtered.slice((page - 1) * limit, (page - 1) * limit + Number(limit));
    res.json({ success: true, count: paginated.length, total: filtered.length, page: Number(page), data: paginated });
  } catch (err) {
    next(err);
  }
};

const getPaymentById = (req, res, next) => {
  try {
    const payment = payments.find(p => p._id === req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { recordPayment, getPayments, getPaymentById };
