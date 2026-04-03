const { prisma } = require('../config/db');

const getSummary = async (req, res, next) => {
  try {
    const { templeId, from, to } = req.query;
    const where = { status: 'PAID' };
    if (templeId) where.templeId = templeId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [aggregate, count] = await Promise.all([
      prisma.order.aggregate({
        where,
        _sum: { amount: true },
        _avg: { amount: true },
        _count: { id: true },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      templeId: templeId || null,
      totalOrders: count,
      totalRevenue: aggregate._sum.amount ?? 0,
      avgOrderValue: aggregate._avg.amount ?? 0,
    });
  } catch (err) {
    next(err);
  }
};

const getByOffering = async (req, res, next) => {
  try {
    const { templeId } = req.query;
    const where = { status: 'PAID' };
    if (templeId) where.templeId = templeId;

    const breakdown = await prisma.order.groupBy({
      by: ['offeringId'],
      where,
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const offeringIds = breakdown.map(row => row.offeringId);
    const offerings = await prisma.offering.findMany({
      where: { id: { in: offeringIds } },
      select: { id: true, name: true },
    });
    const offeringMap = Object.fromEntries(offerings.map(o => [o.id, o.name]));

    res.json(
      breakdown.map(row => ({
        offeringId: row.offeringId,
        offeringName: offeringMap[row.offeringId] ?? 'Unknown',
        count: row._count.id,
        revenue: row._sum.amount ?? 0,
      }))
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getByOffering };
