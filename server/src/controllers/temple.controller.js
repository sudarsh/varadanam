const { prisma } = require('../config/db');

const listTemples = async (_req, res, next) => {
  try {
    const temples = await prisma.temple.findMany({ where: { isActive: true } });
    res.json(temples);
  } catch (err) {
    next(err);
  }
};

const getTemple = async (req, res, next) => {
  try {
    const temple = await prisma.temple.findUnique({
      where: { id: req.params.templeId },
    });
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json(temple);
  } catch (err) {
    next(err);
  }
};

const createTemple = async (req, res, next) => {
  try {
    const temple = await prisma.temple.create({ data: req.body });
    res.status(201).json(temple);
  } catch (err) {
    next(err);
  }
};

const updateTemple = async (req, res, next) => {
  try {
    const temple = await prisma.temple.update({
      where: { id: req.params.templeId },
      data: req.body,
    });
    res.json(temple);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Temple not found' });
    next(err);
  }
};

module.exports = { listTemples, getTemple, createTemple, updateTemple };
