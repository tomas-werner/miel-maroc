import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: 'admin@miel.ma' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@miel.ma',
      passwordHash,
      role: 'admin',
      isActive: true,
    }
  });

  console.log('Admin user created successfully:');
  console.log('Email: admin@miel.ma');
  console.log('Password: admin123');
  console.log('Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
