const router = require('express').Router();
const { body } = require('express-validator');
const { listUsers, createUser, updateUser } = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const validate = require('../middleware/validate');

router.get('/', auth, adminOnly, listUsers);

router.post(
  '/',
  auth,
  adminOnly,
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').isIn(['ADMIN', 'USER']).withMessage('Role must be ADMIN or USER'),
    body('templeId').isUUID().withMessage('Valid templeId required'),
  ],
  validate,
  createUser
);

router.put(
  '/:id',
  auth,
  adminOnly,
  [
    body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
    body('role').optional().isIn(['ADMIN', 'USER']).withMessage('Role must be ADMIN or USER'),
    body('isActive').optional().isBoolean(),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  updateUser
);

module.exports = router;
