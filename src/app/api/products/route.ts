import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    if (inStockOnly) {
      where.variants = {
        some: {
          isActive: true,
          inventory: {
            quantityOnHand: {
              gt: 0,
            },
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { nameFr: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { descriptionFr: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'priceAsc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'priceDesc':
        orderBy = { basePrice: 'desc' };
        break;
      default:
        orderBy = { isFeatured: 'desc', createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            include: {
              inventory: true,
            },
          },
          images: {
            where: { isPrimary: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        categoryId: body.categoryId,
        slug: body.slug,
        nameFr: body.nameFr,
        nameAr: body.nameAr,
        descriptionFr: body.descriptionFr,
        descriptionAr: body.descriptionAr,
        basePrice: body.basePrice,
        currency: body.currency || 'MAD',
        brand: body.brand,
        status: body.status || 'DRAFT',
        isFeatured: body.isFeatured || false,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
