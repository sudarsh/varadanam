const { prisma } = require('../config/db');

const listOfferings = async (req, res, next) => {
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
};

const getOffering = async (req, res, next) => {
  try {
    const offering = await prisma.offering.findUnique({ where: { id: req.params.id } });
    if (!offering) return res.status(404).json({ message: 'Offering not found' });
    res.json(offering);
  } catch (err) {
    next(err);
  }
};

const createOffering = async (req, res, next) => {
  try {
    const offering = await prisma.offering.create({ data: req.body });
    res.status(201).json(offering);
  } catch (err) {
    next(err);
  }
};

const updateOffering = async (req, res, next) => {
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
};

const deleteOffering = async (req, res, next) => {
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
};

module.exports = { listOfferings, getOffering, createOffering, updateOffering, deleteOffering };
