const paymentService = require('../services/paymentService');
const Payment = require('../models/Payment');

const recordPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.recordPayment({
      ...req.body,
      recordedBy: req.user._id,
      receiptFile: req.file,
    });
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const { tenantId, rentCycleId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (tenantId) filter.tenant = tenantId;
    if (rentCycleId) filter.rentCycle = rentCycleId;

    const payments = await Payment.find(filter)
      .populate('tenant', 'name unit')
      .populate('rentCycle', 'month year amountDue')
      .populate('recordedBy', 'name')
      .sort({ paidAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(filter);

    res.json({ success: true, count: payments.length, total, page: Number(page), data: payments });
  } catch (err) {
    next(err);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('tenant', 'name unit phone')
      .populate('rentCycle', 'month year amountDue status')
      .populate('recordedBy', 'name');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { recordPayment, getPayments, getPaymentById };
