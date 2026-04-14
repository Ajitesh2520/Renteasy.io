const Tenant = require('../models/Tenant');

const getAllTenants = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = { owner: req.user._id };
    if (active !== undefined) filter.isActive = active === 'true';

    const tenants = await Tenant.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (err) {
    next(err);
  }
};

const getTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOne({ _id: req.params.id, owner: req.user._id });
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
    res.json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
};

const createTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
};

const updateTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
    res.json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
};

const deleteTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });
    res.json({ success: true, message: 'Tenant deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTenants, getTenant, createTenant, updateTenant, deleteTenant };
