const Tenant = require('../models/Tenant');
const RentCycle = require('../models/RentCycle');
const { RENT_STATUS } = require('../constants/rentStatus');

const generateRentCycles = async (ownerId, month, year) => {
  const tenants = await Tenant.find({ owner: ownerId, isActive: true });
  let created = 0;
  let skipped = 0;

  for (const tenant of tenants) {
    const exists = await RentCycle.findOne({ tenant: tenant._id, month, year });
    if (exists) { skipped++; continue; }

    const dueDate = new Date(year, month - 1, tenant.rentDueDay || 1);
    await RentCycle.create({
      tenant: tenant._id,
      month,
      year,
      amountDue: tenant.monthlyRent,
      dueDate,
      status: RENT_STATUS.PENDING,
      owner: ownerId,
    });
    created++;
  }

  return { created, skipped, total: tenants.length };
};

const getDashboardSummary = async (ownerId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [totalTenants, activeCycles] = await Promise.all([
    Tenant.countDocuments({ owner: ownerId, isActive: true }),
    RentCycle.find({ owner: ownerId, month, year }).populate('tenant', 'name unit'),
  ]);

  const totalDue = activeCycles.reduce((sum, c) => sum + c.amountDue, 0);
  const totalCollected = activeCycles.reduce((sum, c) => sum + c.amountPaid, 0);
  const pending = activeCycles.filter(c => c.status === RENT_STATUS.PENDING).length;
  const paid = activeCycles.filter(c => c.status === RENT_STATUS.PAID).length;
  const overdue = activeCycles.filter(c => c.status === RENT_STATUS.OVERDUE).length;

  return { totalTenants, totalDue, totalCollected, pending, paid, overdue, month, year };
};

const markOverdueCycles = async () => {
  const today = new Date();
  const result = await RentCycle.updateMany(
    { dueDate: { $lt: today }, status: RENT_STATUS.PENDING },
    { $set: { status: RENT_STATUS.OVERDUE } }
  );
  return result.modifiedCount;
};

module.exports = { generateRentCycles, getDashboardSummary, markOverdueCycles };
