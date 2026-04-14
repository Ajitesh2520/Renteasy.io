const express = require('express');
const multer = require('multer');
const path = require('path');
const { recordPayment, getPayments, getPaymentById } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/receipts/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `receipt-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only images and PDFs are allowed'));
  },
});

const router = express.Router();

router.use(protect);

router.route('/').get(getPayments).post(upload.single('receipt'), recordPayment);
router.get('/:id', getPaymentById);

module.exports = router;
