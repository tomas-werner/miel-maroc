import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const where = status ? { orderStatus: status as OrderStatus } : {};

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        }
      },
      items: {
        include: {
          product: {
            select: {
              nameFr: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(orders);
}
