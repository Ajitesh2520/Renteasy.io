const { sendSms } = require('../config/smsProvider');
const { formatCurrency } = require('../utils/helpers');
const logger = require('../utils/logger');

const sendRentReminder = async (tenant, rentCycle) => {
  const balance = rentCycle.amountDue - rentCycle.amountPaid;
  const message =
    `Dear ${tenant.name}, your rent of ${formatCurrency(balance)} for unit ${tenant.unit} ` +
    `is due. Please pay at the earliest. - Property Manager`;

  try {
    await sendSms(tenant.phone, message);
    logger.info(`Reminder sent to tenant ${tenant.name} (${tenant.phone})`);
    return true;
  } catch (error) {
    logger.error(`Failed to send reminder to ${tenant.name}: ${error.message}`);
    return false;
  }
};

const sendPaymentConfirmation = async (tenant, amount, month, year) => {
  const message =
    `Dear ${tenant.name}, your rent payment of ${formatCurrency(amount)} for ` +
    `${month}/${year} has been received. Thank you! - Property Manager`;

  try {
    await sendSms(tenant.phone, message);
    return true;
  } catch (error) {
    logger.error(`Failed to send confirmation to ${tenant.name}: ${error.message}`);
    return false;
  }
};

module.exports = { sendRentReminder, sendPaymentConfirmation };
