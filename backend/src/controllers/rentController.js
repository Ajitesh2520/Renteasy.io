const { rents, tenants } = require('../models/localDb');
const { v4: uuidv4 } = require('uuid');
const { RENT_STATUS } = require('../constants/rentStatus');
const { getCurrentMonthYear } = require('../utils/helpers');

const getRentCycles = (req, res, next) => {
  try {
    const { month, year, status, tenantId } = req.query;
    let filtered = rents.filter(r => r.owner === req.user._id);
    if (month) filtered = filtered.filter(r => r.month === Number(month));
    if (year) filtered = filtered.filter(r => r.year === Number(year));
    if (status) filtered = filtered.filter(r => r.status === status);
    if (tenantId) filtered = filtered.filter(r => r.tenant === tenantId);
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    next(err);
  }
};

const generateMonthlyRent = (req, res, next) => {
  try {
    const { month, year } = req.body || getCurrentMonthYear();
    let created = 0;
    let skipped = 0;
    tenants.filter(t => t.owner === req.user._id && t.isActive).forEach(tenant => {
      const exists = rents.find(r => r.tenant === tenant._id && r.month === month && r.year === year);
      if (exists) { skipped++; return; }
      const dueDate = new Date(year, month - 1, tenant.rentDueDay || 1);
      rents.push({
        _id: uuidv4(),
        tenant: tenant._id,
        month,
        year,
        amountDue: tenant.monthlyRent,
        amountPaid: 0,
        dueDate,
        status: RENT_STATUS.PENDING,
        owner: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      created++;
    });
    res.status(201).json({ success: true, message: `Generated ${created} rent cycles`, data: { created, skipped, total: tenants.length } });
  } catch (err) {
    next(err);
  }
};

const updateRentStatus = (req, res, next) => {
  try {
    const idx = rents.findIndex(r => r._id === req.params.id && r.owner === req.user._id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Rent cycle not found' });
    rents[idx].status = req.body.status;
    rents[idx].updatedAt = new Date();
    res.json({ success: true, data: rents[idx] });
  } catch (err) {
    next(err);
  }
};

const getDashboardSummary = (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const userTenants = tenants.filter(t => t.owner === req.user._id && t.isActive);
    const activeCycles = rents.filter(r => r.owner === req.user._id && r.month === month && r.year === year);
    const totalDue = activeCycles.reduce((sum, c) => sum + c.amountDue, 0);
    const totalCollected = activeCycles.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
    const pending = activeCycles.filter(c => c.status === RENT_STATUS.PENDING).length;
    const paid = activeCycles.filter(c => c.status === RENT_STATUS.PAID).length;
    const overdue = activeCycles.filter(c => c.status === RENT_STATUS.OVERDUE).length;
    res.json({ success: true, data: { totalTenants: userTenants.length, totalDue, totalCollected, pending, paid, overdue, month, year } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRentCycles, generateMonthlyRent, updateRentStatus, getDashboardSummary };
