const cron = require('node-cron');
const { sendPendingReminders } = require('../services/reminderService');
const { markOverdueCycles } = require('../services/rentService');
const logger = require('../utils/logger');

// Run every day at 9:00 AM
const startRentReminderJob = () => {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running rent reminder cron job...');
    try {
      const overdue = await markOverdueCycles();
      logger.info(`Marked ${overdue} cycles as overdue`);

      const result = await sendPendingReminders();
      logger.info(`Reminders: ${result.sent} sent, ${result.failed} failed`);
    } catch (error) {
      logger.error(`Cron job error: ${error.message}`);
    }
  }, {
    timezone: 'Asia/Kolkata',
  });

  logger.info('Rent reminder cron job scheduled (daily at 9:00 AM IST)');
};

module.exports = { startRentReminderJob };
