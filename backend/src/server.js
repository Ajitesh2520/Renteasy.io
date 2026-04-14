require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startRentReminderJob } = require('./jobs/rentReminderJob');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'receipts');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Start cron jobs
  startRentReminderJob();
};

startServer().catch((err) => {
  logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
