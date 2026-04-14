const RentCycle = require('../models/RentCycle');
const { RENT_STATUS } = require('../constants/rentStatus');
const { sendRentReminder } = require('./notificationService');
const logger = require('../utils/logger');

const sendPendingReminders = async () => {
  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  // Find pending cycles due within 3 days or overdue, reminder not yet sent
  const cycles = await RentCycle.find({
    status: { $in: [RENT_STATUS.PENDING, RENT_STATUS.OVERDUE, RENT_STATUS.PARTIAL] },
    dueDate: { $lte: threeDaysFromNow },
    reminderSent: false,
  }).populate('tenant');

  logger.info(`Found ${cycles.length} rent cycles needing reminders`);

  let sent = 0;
  let failed = 0;

  for (const cycle of cycles) {
    if (!cycle.tenant || !cycle.tenant.isActive) continue;

    const success = await sendRentReminder(cycle.tenant, cycle);
    if (success) {
      await RentCycle.findByIdAndUpdate(cycle._id, {
        reminderSent: true,
        reminderSentAt: new Date(),
      });
      sent++;
    } else {
      failed++;
    }
  }

  logger.info(`Reminder job complete: ${sent} sent, ${failed} failed`);
  return { sent, failed };
};

module.exports = { sendPendingReminders };
