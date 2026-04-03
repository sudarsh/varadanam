const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/prisma');

// GET /api/reports/summary?templeId=xxx&from=2024-01-01&to=2024-12-31
router.get('/summary', async (req, res, next) => {
  try {
    const { templeId, from, to } = req.query;
    const where = { paymentStatus: 'completed' };
    if (templeId) where.templeId = templeId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [aggregate, count] = await Promise.all([
      prisma.order.aggregate({
        where,
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      templeId: templeId || null,
      totalOrders: count,
      totalRevenue: aggregate._sum.totalAmount ?? 0,
      avgOrderValue: aggregate._avg.totalAmount ?? 0,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/reports/by-offering?templeId=xxx
router.get('/by-offering', async (req, res, next) => {
  try {
    const { templeId } = req.query;
    const where = { paymentStatus: 'completed' };
    if (templeId) where.templeId = templeId;

    const breakdown = await prisma.order.groupBy({
      by: ['offeringId', 'offeringName'],
      where,
      _sum: { totalAmount: true },
      _count: { id: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
    });

    res.json(
      breakdown.map(row => ({
        offeringId: row.offeringId,
        offeringName: row.offeringName,
        count: row._count.id,
        revenue: row._sum.totalAmount ?? 0,
      }))
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
