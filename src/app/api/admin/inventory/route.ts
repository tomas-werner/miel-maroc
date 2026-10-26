import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const inventory = await prisma.inventory.findMany({
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              nameFr: true,
              nameAr: true,
            }
          }
        }
      }
    },
    orderBy: {
      variant: {
        product: {
          nameFr: 'asc'
        }
      }
    }
  });

  return NextResponse.json(inventory);
}
