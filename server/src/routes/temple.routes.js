const router = require('express').Router();
const { body } = require('express-validator');
const { listTemples, getTemple, createTemple, updateTemple } = require('../controllers/temple.controller');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');

const templeCreateRules = [
  body('name').notEmpty().trim().withMessage('Temple name is required'),
  body('location').notEmpty().trim().withMessage('Location is required'),
  body('tagline').notEmpty().trim().withMessage('Tagline is required'),
];

const templeUpdateRules = [
  body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
  body('location').optional().notEmpty().trim().withMessage('Location cannot be empty'),
  body('tagline').optional().notEmpty().trim().withMessage('Tagline cannot be empty'),
  body('accentColor').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid hex color'),
  body('heroStyle').optional().isIn(['SOLID', 'GRADIENT', 'IMAGE']).withMessage('Invalid heroStyle'),
  body('heroOverlayOpacity').optional().isInt({ min: 0, max: 100 }).withMessage('Opacity must be 0–100'),
  body('announcementEnabled').optional().isBoolean(),
  body('phone').optional().trim(),
  body('email').optional().isEmail().withMessage('Valid email required'),
];

router.get('/', listTemples);
router.get('/:templeId', getTemple);
router.post('/', auth, adminOnly, templeCreateRules, validate, createTemple);
router.put('/:templeId', auth, adminOnly, templeUpdateRules, validate, updateTemple);

module.exports = router;
