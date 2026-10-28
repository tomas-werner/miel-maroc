import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// GET - List all products
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            nameFr: true,
            nameAr: true,
          },
        },
        variants: {
          include: {
            inventory: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      nameFr,
      nameAr,
      descriptionFr,
      descriptionAr,
      categoryId,
      brand,
      basePrice,
      currency,
      status,
      isFeatured,
      variants,
    } = body;

    // Generate slug from French name
    const slug = nameFr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        slug,
        nameFr,
        nameAr,
        descriptionFr,
        descriptionAr,
        categoryId,
        brand,
        basePrice,
        currency,
        status,
        isFeatured,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        variants: {
          create: variants.map((v: any) => ({
            sku: v.sku,
            attributes: v.attributes,
            priceOverride: v.priceOverride,
            isActive: v.isActive,
            inventory: {
              create: {
                quantityOnHand: v.stock,
                quantityReserved: 0,
              },
            },
          })),
        },
      },
      include: {
        variants: {
          include: {
            inventory: true,
          },
        },
      },
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
