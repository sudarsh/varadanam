const router = require('express').Router();
const { body } = require('express-validator');
const { listOrders, getOrder, createOrder, updatePayment } = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');

router.get('/', auth, adminOnly, listOrders);
router.get('/:id', auth, adminOnly, getOrder);

router.post(
  '/',
  [
    body('offeringId').isUUID().withMessage('Valid offeringId required'),
    body('devoteeName').optional().trim(),
    body('guestEmail').optional().isEmail().withMessage('Valid email required'),
    body('guestMobile').optional().trim(),
    body('nakshatra').optional().trim(),
    body('gothram').optional().trim(),
    body('specialInstructions').optional().trim(),
  ],
  validate,
  createOrder
);

router.patch(
  '/:id/payment',
  auth,
  adminOnly,
  [
    body('status')
      .isIn(['CREATED', 'PAID', 'FAILED', 'REFUNDED'])
      .withMessage('Invalid status'),
    body('razorpayPaymentId').optional().trim(),
    body('razorpaySignature').optional().trim(),
    body('paymentMethod').optional().trim(),
  ],
  validate,
  updatePayment
);

module.exports = router;
