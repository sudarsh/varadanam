const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

const listUsers = async (req, res, next) => {
  try {
    const { templeId } = req.query;
    const where = {};
    if (templeId) where.templeId = templeId;

    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, templeId: true, isActive: true, lastLoginAt: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, templeId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, templeId },
      select: { id: true, name: true, email: true, role: true, templeId: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ message: 'Email already exists' });
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, role, isActive, password } = req.body;
    const data = { name, role, isActive };
    if (password) data.passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, name: true, email: true, role: true, templeId: true, isActive: true },
    });
    res.json(user);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    next(err);
  }
};

module.exports = { listUsers, createUser, updateUser };
