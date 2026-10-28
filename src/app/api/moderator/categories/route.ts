import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// GET - List all categories with hierarchy
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        children: {
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      where: {
        parentId: null,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { nameFr: 'asc' },
      ],
    });

    // Flatten the hierarchy for easier display
    const flattenCategories = (cats: any[]): any[] => {
      const result: any[] = [];
      for (const cat of cats) {
        result.push({
          ...cat,
          productsCount: cat._count.products,
        });
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenCategories(cat.children));
        }
      }
      return result;
    };

    return NextResponse.json(flattenCategories(categories));
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
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
      parentId,
      sortOrder,
      isActive,
      slug,
    } = body;

    const category = await prisma.category.create({
      data: {
        slug,
        nameFr,
        nameAr,
        descriptionFr,
        descriptionAr,
        parentId,
        sortOrder,
        isActive,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
