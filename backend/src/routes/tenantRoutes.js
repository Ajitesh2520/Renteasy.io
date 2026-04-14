const express = require('express');
const {
  getAllTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
} = require('../controllers/tenantController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllTenants).post(createTenant);
router.route('/:id').get(getTenant).put(updateTenant).delete(deleteTenant);

module.exports = router;
