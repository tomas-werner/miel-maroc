import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalProducts, totalCategories, activeBanners, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.contentBlock.count({
        where: {
          blockType: 'banner',
          isActive: true,
        },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nameFr: true,
          nameAr: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalCategories,
      activeBanners,
      recentProducts,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
