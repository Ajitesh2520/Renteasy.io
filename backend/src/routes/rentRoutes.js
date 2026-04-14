const express = require('express');
const {
  getRentCycles,
  generateMonthlyRent,
  updateRentStatus,
  getDashboardSummary,
} = require('../controllers/rentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/summary', getDashboardSummary);
router.route('/').get(getRentCycles).post(generateMonthlyRent);
router.patch('/:id/status', updateRentStatus);

module.exports = router;
