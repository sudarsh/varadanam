const router = require('express').Router();
const { body } = require('express-validator');
const { listOfferings, getOffering, createOffering, updateOffering, deleteOffering } = require('../controllers/offering.controller');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');

const offeringRules = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('category')
    .isIn(['DAILY_RITUAL', 'FESTIVAL', 'ARCHANA', 'ANNADANAM', 'DONATION', 'SPECIAL_SEVA'])
    .withMessage('Invalid category'),
  body('sortOrder').optional().isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
];

router.get('/', listOfferings);
router.get('/:id', getOffering);
router.post('/', auth, adminOnly, offeringRules, validate, createOffering);
router.put('/:id', auth, adminOnly, offeringRules, validate, updateOffering);
router.delete('/:id', auth, adminOnly, deleteOffering);

module.exports = router;
