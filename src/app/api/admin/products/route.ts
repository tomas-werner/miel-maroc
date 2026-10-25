import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: {
        include: {
          inventory: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nameFr, nameAr, descriptionFr, descriptionAr, categoryId, basePrice, currency, status, isFeatured, brand, variants } = body;

    // Generate slug from nameFr
    const slug = nameFr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        nameFr,
        nameAr,
        descriptionFr,
        descriptionAr,
        categoryId,
        basePrice,
        currency: currency || 'MAD',
        status: status || 'DRAFT',
        isFeatured: isFeatured || false,
        brand: brand || null,
        slug,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        variants: {
          create: variants.map((v: any) => ({
            sku: v.sku,
            attributes: v.attributes,
            priceOverride: v.priceOverride,
            isActive: v.isActive !== false,
            inventory: {
              create: {
                quantityOnHand: 0,
                quantityReserved: 0,
                lowStockThreshold: 5,
              }
            }
          }))
        }
      },
      include: {
        variants: true,
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
