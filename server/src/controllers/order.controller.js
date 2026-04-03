const { prisma } = require('../config/db');

const listOrders = async (req, res, next) => {
  try {
    const { templeId, status } = req.query;
    const where = {};
    if (templeId) where.templeId = templeId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { offering: { select: { name: true, amount: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
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
};

const createOrder = async (req, res, next) => {
  try {
    const {
      offeringId,
      devoteeName,
      guestEmail,
      guestMobile,
      nakshatra,
      gothram,
      specialInstructions,
    } = req.body;

    const offering = await prisma.offering.findUnique({ where: { id: offeringId } });
    if (!offering || !offering.isActive) {
      return res.status(400).json({ message: 'Offering not available' });
    }

    const order = await prisma.order.create({
      data: {
        templeId: offering.templeId,
        offeringId: offering.id,
        devoteeName,
        guestEmail,
        guestMobile,
        nakshatra,
        gothram,
        specialInstructions,
        amount: offering.amount,
      },
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { paymentMethod, status, razorpayPaymentId, razorpaySignature } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        paymentMethod,
        status,
        razorpayPaymentId,
        razorpaySignature,
      },
    });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Order not found' });
    next(err);
  }
};

module.exports = { listOrders, getOrder, createOrder, updatePayment };
