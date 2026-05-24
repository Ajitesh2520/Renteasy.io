const { tenants } = require('../models/localDb');
const { v4: uuidv4 } = require('uuid');

const getAllTenants = (req, res, next) => {
  try {
    const { active } = req.query;
    let filtered = tenants.filter(t => t.owner === req.user._id);
    if (active !== undefined) filtered = filtered.filter(t => t.isActive === (active === 'true'));
    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    next(err);
  }
};

const getTenant = (req, res, next) => {
  try {
    const tenant = tenants.find(t => t._id === req.params.id && t.owner === req.user._id);
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
    res.json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
};

const createTenant = (req, res, next) => {
  try {
    const tenant = { ...req.body, _id: uuidv4(), owner: req.user._id, createdAt: new Date(), isActive: true };
    tenants.push(tenant);
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
};

const updateTenant = (req, res, next) => {
  try {
    const idx = tenants.findIndex(t => t._id === req.params.id && t.owner === req.user._id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Tenant not found' });
    tenants[idx] = { ...tenants[idx], ...req.body };
    res.json({ success: true, data: tenants[idx] });
  } catch (err) {
    next(err);
  }
};

const deleteTenant = (req, res, next) => {
  try {
    const idx = tenants.findIndex(t => t._id === req.params.id && t.owner === req.user._id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Tenant not found' });
    tenants[idx].isActive = false;
    res.json({ success: true, message: 'Tenant deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTenants, getTenant, createTenant, updateTenant, deleteTenant };
