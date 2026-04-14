const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = require('./env');
const logger = require('../utils/logger');

let client;

const getSmsClient = () => {
  if (!client) {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      logger.warn('Twilio credentials not configured. SMS will be disabled.');
      return null;
    }
    client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return client;
};

const sendSms = async (to, body) => {
  const smsClient = getSmsClient();
  if (!smsClient) {
    logger.warn(`SMS not sent to ${to}: SMS provider not configured.`);
    return null;
  }
  try {
    const message = await smsClient.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to,
    });
    logger.info(`SMS sent to ${to}: SID ${message.sid}`);
    return message;
  } catch (error) {
    logger.error(`SMS failed to ${to}: ${error.message}`);
    throw error;
  }
};

module.exports = { sendSms };
