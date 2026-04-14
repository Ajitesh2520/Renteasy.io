const RentCycle = require('../models/RentCycle');
const rentService = require('../services/rentService');
const { getCurrentMonthYear } = require('../utils/helpers');

const getRentCycles = async (req, res, next) => {
  try {
    const { month, year, status, tenantId } = req.query;
    const filter = { owner: req.user._id };
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (status) filter.status = status;
    if (tenantId) filter.tenant = tenantId;

    const cycles = await RentCycle.find(filter)
      .populate('tenant', 'name unit phone monthlyRent')
      .sort({ year: -1, month: -1 });

    res.json({ success: true, count: cycles.length, data: cycles });
  } catch (err) {
    next(err);
  }
};

const generateMonthlyRent = async (req, res, next) => {
  try {
    const { month, year } = req.body || getCurrentMonthYear();
    const result = await rentService.generateRentCycles(req.user._id, month, year);
    res.status(201).json({ success: true, message: `Generated ${result.created} rent cycles`, data: result });
  } catch (err) {
    next(err);
  }
};

const updateRentStatus = async (req, res, next) => {
  try {
    const cycle = await RentCycle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!cycle) return res.status(404).json({ success: false, message: 'Rent cycle not found' });
    res.json({ success: true, data: cycle });
  } catch (err) {
    next(err);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await rentService.getDashboardSummary(req.user._id);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRentCycles, generateMonthlyRent, updateRentStatus, getDashboardSummary };
