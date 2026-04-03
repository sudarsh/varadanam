const router = require('express').Router();
const { body } = require('express-validator');
const { login, me } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    body('templeId').notEmpty().withMessage('templeId required'),
  ],
  validate,
  login
);

router.get('/me', auth, me);

module.exports = router;
