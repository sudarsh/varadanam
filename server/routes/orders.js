const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// GET /api/orders?templeId=xxx&status=confirmed
router.get('/', async (req, res, next) => {
  try {
    const { templeId, status } = req.query;
    const where = {};
    if (templeId) where.templeId = templeId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { offering: { select: { name: true, amount: true, currency: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { offering: true },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const { offeringId, quantity = 1, devoteeName, devoteeEmail, devoteePhone, nakshatram, gotram, notes } = req.body;

    const offering = await prisma.offering.findUnique({ where: { id: offeringId } });
    if (!offering || !offering.isActive) {
      return res.status(400).json({ message: 'Offering not available' });
    }

    const order = await prisma.order.create({
      data: {
        templeId: offering.templeId,
        offeringId: offering.id,
        offeringName: offering.name,
        offeringAmount: offering.amount,
        offeringCurrency: offering.currency,
        devoteeName,
        devoteeEmail,
        devoteePhone,
        nakshatram,
        gotram,
        quantity,
        totalAmount: Number(offering.amount) * quantity,
        notes: notes || '',
      },
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/payment
router.patch('/:id/payment', async (req, res, next) => {
  try {
    const { paymentMethod, paymentStatus, transactionId, gatewayResponse } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentMethod,
        paymentStatus,
        transactionId,
        gatewayResponse,
        paidAt: paymentStatus === 'completed' ? new Date() : undefined,
        status: paymentStatus === 'completed' ? 'confirmed' : undefined,
      },
    });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Order not found' });
    next(err);
  }
});

module.exports = router;
