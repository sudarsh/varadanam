const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// GET /api/temples
router.get('/', async (_req, res, next) => {
  try {
    const temples = await prisma.temple.findMany({ where: { isActive: true } });
    res.json(temples);
  } catch (err) {
    next(err);
  }
});

// GET /api/temples/:templeId
router.get('/:templeId', async (req, res, next) => {
  try {
    const temple = await prisma.temple.findUnique({
      where: { templeId: req.params.templeId },
    });
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json(temple);
  } catch (err) {
    next(err);
  }
});

// POST /api/temples
router.post('/', async (req, res, next) => {
  try {
    const temple = await prisma.temple.create({ data: req.body });
    res.status(201).json(temple);
  } catch (err) {
    next(err);
  }
});

// PUT /api/temples/:templeId
router.put('/:templeId', async (req, res, next) => {
  try {
    const temple = await prisma.temple.update({
      where: { templeId: req.params.templeId },
      data: req.body,
    });
    res.json(temple);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Temple not found' });
    next(err);
  }
});

module.exports = router;
