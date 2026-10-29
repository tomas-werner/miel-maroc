import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const defaultCategories = [
  {
    id: 'cat-miel',
    slug: 'miel',
    nameFr: 'Miels Rares & Terroir',
    nameAr: 'أنواع العسل النادرة',
    descriptionFr: 'Daghmous, Thym, Oranger, Sidr pur',
    descriptionAr: 'الدغموس، السدر، الزعتر، الليمون النقي',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-argan',
    slug: 'argan',
    nameFr: 'Huile d’Argan & Soins',
    nameAr: 'زيت أركان والعناية',
    descriptionFr: '100% Bio Cosmétique & Culinaire',
    descriptionAr: 'طبيعي 100% للتجميل والتغذية',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-amlou',
    slug: 'amlou',
    nameFr: 'Amlou Artisanal',
    nameAr: 'أملو تقليدي بالأركان',
    descriptionFr: 'Amandes beldi & miel d’oranger',
    descriptionAr: 'لوز بلدي وعسل الليمون',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-safran',
    slug: 'safran',
    nameFr: 'Safran Pur & Épices',
    nameAr: 'زعفران خالص وتوابل',
    descriptionFr: 'Appellation d’Origine Taliouine',
    descriptionAr: 'زعفران تاليوين الأصيل',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-packs',
    slug: 'packs',
    nameFr: 'Coffrets & Cadeaux',
    nameAr: 'صناديق وباقات هدايا',
    descriptionFr: 'Assortiments dégustation prestige',
    descriptionAr: 'تشكيلات فاخرة للمناسبات',
    sortOrder: 5,
    isActive: true,
  },
];

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    if (categories && categories.length > 0) {
      return NextResponse.json({ categories });
    }
    return NextResponse.json({ categories: defaultCategories });
  } catch (error) {
    console.warn('Prisma categories fetch failed, returning default categories:', error);
    return NextResponse.json({ categories: defaultCategories });
  }
}
