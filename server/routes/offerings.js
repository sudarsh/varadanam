const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// GET /api/offerings?templeId=xxx&includeInactive=true
router.get('/', async (req, res, next) => {
  try {
    const { templeId, includeInactive } = req.query;
    const where = {};
    if (templeId) where.templeId = templeId;
    if (!includeInactive) where.isActive = true;

    const offerings = await prisma.offering.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(offerings);
  } catch (err) {
    next(err);
  }
});

// GET /api/offerings/:id
router.get('/:id', async (req, res, next) => {
  try {
    const offering = await prisma.offering.findUnique({ where: { id: req.params.id } });
    if (!offering) return res.status(404).json({ message: 'Offering not found' });
    res.json(offering);
  } catch (err) {
    next(err);
  }
});

// POST /api/offerings
router.post('/', async (req, res, next) => {
  try {
    const offering = await prisma.offering.create({ data: req.body });
    res.status(201).json(offering);
  } catch (err) {
    next(err);
  }
});

// PUT /api/offerings/:id
router.put('/:id', async (req, res, next) => {
  try {
    const offering = await prisma.offering.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(offering);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Offering not found' });
    next(err);
  }
});

// DELETE /api/offerings/:id  (soft delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const offering = await prisma.offering.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Offering deactivated', offering });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Offering not found' });
    next(err);
  }
});

module.exports = router;
