const router = require('express').Router();
const { getSummary, getByOffering } = require('../controllers/report.controller');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/summary', auth, adminOnly, getSummary);
router.get('/by-offering', auth, adminOnly, getByOffering);

module.exports = router;
