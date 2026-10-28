import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding administrative and moderator users...');

  // 1. Admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@miel.ma' },
    update: {
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: 'admin@miel.ma',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✓ Admin user configured:');
  console.log('  Email: admin@miel.ma');
  console.log('  Role: ADMIN');
  console.log('  Password: admin123');

  // 2. Moderator user
  const moderatorPasswordHash = await bcrypt.hash('moderator123', 10);
  const moderator = await prisma.adminUser.upsert({
    where: { email: 'moderator@miel.ma' },
    update: {
      role: 'MODERATOR',
      isActive: true,
    },
    create: {
      email: 'moderator@miel.ma',
      passwordHash: moderatorPasswordHash,
      role: 'MODERATOR',
      isActive: true,
    },
  });
  console.log('✓ Moderator user configured:');
  console.log('  Email: moderator@miel.ma');
  console.log('  Role: MODERATOR');
  console.log('  Password: moderator123');

  console.log('\nSeed completed successfully.');
  console.log('Please change passwords after first login!');
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

