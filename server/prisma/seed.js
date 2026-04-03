const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Temple
  const temple = await prisma.temple.upsert({
    where: { id: 'seed-temple-id' },
    update: {},
    create: {
      id: 'seed-temple-id',
      name: 'Sri Varadanam Temple',
      location: 'Chennai, Tamil Nadu',
      tagline: 'A place of peace and devotion',
      accentColor: '#C8590A',
    },
  });
  console.log(`Temple: ${temple.name} (${temple.id})`);

  // Admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email_templeId: { email: 'admin@varadanam.com', templeId: temple.id } },
    update: {},
    create: {
      templeId: temple.id,
      name: 'Admin',
      email: 'admin@varadanam.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user: ${admin.email}`);

  // Sample offerings
  const offerings = [
    { name: 'Ganesh Archana', description: 'Daily archana to Lord Ganesh', amount: 51, category: 'ARCHANA', emoji: '🙏', sortOrder: 1 },
    { name: 'Abhishekam', description: 'Sacred bathing ritual with milk and honey', amount: 251, category: 'DAILY_RITUAL', emoji: '🪔', sortOrder: 2 },
    { name: 'Sahasranama Archana', description: 'Recitation of the thousand names', amount: 501, category: 'SPECIAL_SEVA', emoji: '📿', sortOrder: 3 },
    { name: 'Annadanam', description: 'Sponsoring a meal for devotees', amount: 1001, category: 'ANNADANAM', emoji: '🍚', sortOrder: 4 },
  ];

  for (const o of offerings) {
    const offering = await prisma.offering.upsert({
      where: { id: `seed-offering-${o.sortOrder}` },
      update: {},
      create: { id: `seed-offering-${o.sortOrder}`, templeId: temple.id, ...o },
    });
    console.log(`Offering: ${offering.name}`);
  }

  console.log('\nDone! Login at /admin/login');
  console.log('  Email:    admin@varadanam.com');
  console.log('  Password: admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
