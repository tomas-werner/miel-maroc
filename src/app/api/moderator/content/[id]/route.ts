import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// PATCH - Update a content block
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const contentBlock = await prisma.contentBlock.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error('Content block update error:', error);
    return NextResponse.json(
      { error: 'Failed to update content block' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a content block
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.contentBlock.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content block deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content block' },
      { status: 500 }
    );
  }
}
