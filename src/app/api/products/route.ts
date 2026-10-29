import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { TERROIR_PRODUCTS } from '@/lib/products/catalog';

export const runtime = 'nodejs';

function getFallbackProductsList() {
  return Object.values(TERROIR_PRODUCTS).map((p) => ({
    id: p.id,
    slug: p.slug,
    nameFr: p.nameFr,
    nameAr: p.nameAr,
    descriptionFr: p.shortDescFr || p.longDescFr,
    descriptionAr: p.shortDescAr || p.longDescAr,
    basePrice: p.basePrice,
    currency: 'MAD',
    brand: 'Miel Maroc',
    status: 'PUBLISHED',
    isFeatured: true,
    categoryId: `cat-${p.categorySlug}`,
    category: {
      id: `cat-${p.categorySlug}`,
      slug: p.categorySlug,
      nameFr: p.categoryNameFr,
      nameAr: p.categoryNameAr,
    },
    images: (p.images || []).map((img, idx) => ({
      id: `img-${p.id}-${idx}`,
      url: img.url,
      storageKey: img.url,
      altFr: img.altFr,
      altAr: img.altAr,
      isPrimary: idx === 0,
      sortOrder: idx,
    })),
    variants: (p.variants || []).map((v) => ({
      id: v.id || `var-${p.id}-${v.sku}`,
      sku: v.sku || `${p.slug.toUpperCase()}-${v.labelFr}`,
      priceOverride: v.price,
      isActive: true,
      attributes: { format: v.labelFr },
      inventory: { quantityOnHand: v.stock || 50 },
    })),
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const inStockOnly = searchParams.get('inStockOnly') === 'true';
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    const where: any = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
      ];
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

    const [dbProducts, total] = await Promise.all([
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
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    if (dbProducts && dbProducts.length > 0) {
      return NextResponse.json({
        products: dbProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (dbError) {
    console.warn('Prisma query failed, falling back to curated Terroir products:', dbError);
  }

  // Fallback to Terroir Products
  let filtered = getFallbackProductsList();

  if (category) {
    filtered = filtered.filter(
      (p) =>
        p.category?.slug?.toLowerCase() === category.toLowerCase() ||
        p.categoryId?.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    filtered = filtered.filter((p) => p.basePrice >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    filtered = filtered.filter((p) => p.basePrice <= max);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nameFr.toLowerCase().includes(s) ||
        p.nameAr.toLowerCase().includes(s) ||
        p.descriptionFr.toLowerCase().includes(s) ||
        p.descriptionAr.toLowerCase().includes(s)
    );
  }

  if (sortBy === 'priceAsc') {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === 'priceDesc') {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  }

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    products: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    },
    isFallback: true,
  });
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
