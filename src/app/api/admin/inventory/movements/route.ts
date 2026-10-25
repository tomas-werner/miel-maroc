import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.userType !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { variantId, movementType, quantityDelta, reason } = body;

    const inv = await prisma.inventory.findUnique({
      where: { variantId },
    });
    if (!inv) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }

    // Create movement
    const movement = await prisma.inventoryMovement.create({
      data: {
        variantId,
        inventoryId: inv.id,
        movementType,
        quantityDelta,
        reason,
        createdBy: session.user?.id,
      }
    });

    // Update inventory
    const inventory = await prisma.inventory.update({
      where: { variantId },
      data: {
        quantityOnHand: {
          increment: quantityDelta,
        }
      }
    });

    return NextResponse.json({ movement, inventory }, { status: 201 });
  } catch (error) {
    console.error('Movement creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create movement' },
      { status: 500 }
    );
  }
}
