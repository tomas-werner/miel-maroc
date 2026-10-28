import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Auto-load .env if DATABASE_URL is not yet defined in environment
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const val = values.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  } catch (err) {
    // Ignore and proceed
  }
}

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@miel.ma' },
    update: {},
    create: {
      email: 'admin@miel.ma',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create moderator user
  const moderatorPassword = await bcrypt.hash('moderator123', 10);
  const moderator = await prisma.adminUser.upsert({
    where: { email: 'moderator@miel.ma' },
    update: {},
    create: {
      email: 'moderator@miel.ma',
      passwordHash: moderatorPassword,
      role: 'MODERATOR',
      isActive: true,
    },
  });
  console.log('Created moderator user:', moderator.email);

  // Create categories
  const category1 = await prisma.category.create({
    data: {
      slug: 'alimentation',
      nameFr: 'Alimentation',
      nameAr: 'الأغذية',
      descriptionFr: 'Produits alimentaires de qualité',
      descriptionAr: 'منتجات غذائية عالية الجودة',
      sortOrder: 1,
      isActive: true,
    },
  });

  const category2 = await prisma.category.create({
    data: {
      slug: 'beaute-soins',
      nameFr: 'Beauté et Soins',
      nameAr: 'الجمال والعناية',
      descriptionFr: 'Produits de beauté et soins personnels',
      descriptionAr: 'منتجات الجمال والعناية الشخصية',
      sortOrder: 2,
      isActive: true,
    },
  });

  const category3 = await prisma.category.create({
    data: {
      slug: 'maison',
      nameFr: 'Maison',
      nameAr: 'المنزل',
      descriptionFr: 'Articles pour la maison',
      descriptionAr: 'لوازم المنزل',
      sortOrder: 3,
      isActive: true,
    },
  });

  console.log('Created categories');

  // Create products
  const product1 = await prisma.product.create({
    data: {
      categoryId: category1.id,
      slug: 'miel-pur',
      nameFr: 'Miel Pur',
      nameAr: 'عسل نقي',
      descriptionFr: 'Miel pur 100% naturel, récolté dans les régions montagneuses du Maroc.',
      descriptionAr: 'عسل نقي 100٪ طبيعي، يتم جمعه من المناطق الجبلية في المغرب.',
      basePrice: 150,
      currency: 'MAD',
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: new Date(),
      variants: {
        create: [
          {
            sku: 'MIEL-500G',
            attributes: { weight: '500g' },
            priceOverride: 150,
            isActive: true,
            inventory: {
              create: {
                quantityOnHand: 50,
                quantityReserved: 0,
                lowStockThreshold: 10,
              },
            },
          },
          {
            sku: 'MIEL-1KG',
            attributes: { weight: '1kg' },
            priceOverride: 280,
            isActive: true,
            inventory: {
              create: {
                quantityOnHand: 30,
                quantityReserved: 0,
                lowStockThreshold: 5,
              },
            },
          },
        ],
      },
      images: {
        create: [
          {
            storageKey: 'miel-500g.jpg',
            altFr: 'Pot de miel 500g',
            altAr: 'وعاء عسل 500 جرام',
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      categoryId: category2.id,
      slug: 'huile-dargan',
      nameFr: 'Huile d\'Argan',
      nameAr: 'زيت الأرغان',
      descriptionFr: 'Huile d\'argan bio, idéale pour les soins de la peau et des cheveux.',
      descriptionAr: 'زيت أرغان عضوي، مثالي للعناية بالبشرة والشعر.',
      basePrice: 200,
      currency: 'MAD',
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: new Date(),
      variants: {
        create: [
          {
            sku: 'ARGAN-100ML',
            attributes: { volume: '100ml' },
            priceOverride: 200,
            isActive: true,
            inventory: {
              create: {
                quantityOnHand: 40,
                quantityReserved: 0,
                lowStockThreshold: 8,
              },
            },
          },
        ],
      },
      images: {
        create: [
          {
            storageKey: 'huile-argan.jpg',
            altFr: 'Bouteille d\'huile d\'argan',
            altAr: 'زجاجة زيت الأرغان',
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      categoryId: category3.id,
      slug: 'tapis-traditionnel',
      nameFr: 'Tapis Traditionnel',
      nameAr: 'سجادة تقليدية',
      descriptionFr: 'Tapis marocain traditionnel, tissé à la main par des artisans locaux.',
      descriptionAr: 'سجادة مغربية تقليدية، منسوجة يدوياً من قبل الحرفيين المحليين.',
      basePrice: 800,
      currency: 'MAD',
      status: 'PUBLISHED',
      isFeatured: false,
      publishedAt: new Date(),
      variants: {
        create: [
          {
            sku: 'TAPIS-2x3',
            attributes: { size: '2x3m' },
            priceOverride: 800,
            isActive: true,
            inventory: {
              create: {
                quantityOnHand: 15,
                quantityReserved: 0,
                lowStockThreshold: 3,
              },
            },
          },
        ],
      },
      images: {
        create: [
          {
            storageKey: 'tapis.jpg',
            altFr: 'Tapis marocain traditionnel',
            altAr: 'سجادة مغربية تقليدية',
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log('Created products');

  // Create shipping zones
  await prisma.shippingZone.create({
    data: {
      nameFr: 'Casablanca',
      nameAr: 'الدار البيضاء',
      matchingRules: { cities: ['Casablanca', 'الدار البيضاء'] },
      fee: 30,
      estimatedMinDays: 1,
      estimatedMaxDays: 2,
      isActive: true,
    },
  });

  await prisma.shippingZone.create({
    data: {
      nameFr: 'Rabat',
      nameAr: 'الرباط',
      matchingRules: { cities: ['Rabat', 'الرباط'] },
      fee: 35,
      estimatedMinDays: 1,
      estimatedMaxDays: 2,
      isActive: true,
    },
  });

  await prisma.shippingZone.create({
    data: {
      nameFr: 'Autres villes',
      nameAr: 'مدن أخرى',
      matchingRules: { regions: ['all'] },
      fee: 50,
      estimatedMinDays: 2,
      estimatedMaxDays: 4,
      isActive: true,
    },
  });

  console.log('Created shipping zones');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
