require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./lib/prisma');

const templeRoutes = require('./routes/temple');
const offeringRoutes = require('./routes/offerings');
const orderRoutes = require('./routes/orders');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/temples', templeRoutes);
app.use('/api/offerings', offeringRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to DB then start server
prisma
  .$connect()
  .then(() => {
    console.warn('PostgreSQL connected via Prisma');
    app.listen(process.env.PORT || 5000, () =>
      console.warn(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
