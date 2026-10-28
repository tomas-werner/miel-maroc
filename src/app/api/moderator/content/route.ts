import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// GET - List all content blocks
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentBlocks = await prisma.contentBlock.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(contentBlocks);
  } catch (error) {
    console.error('Content blocks fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content blocks' },
      { status: 500 }
    );
  }
}

// POST - Create a new content block
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      blockType,
      titleFr,
      titleAr,
      bodyFr,
      bodyAr,
      mediaKey,
      targetUrl,
      sortOrder,
      isActive,
      startsAt,
      endsAt,
    } = body;

    const contentBlock = await prisma.contentBlock.create({
      data: {
        blockType,
        titleFr,
        titleAr,
        bodyFr,
        bodyAr,
        mediaKey,
        targetUrl,
        sortOrder,
        isActive,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
      },
    });

    return NextResponse.json(contentBlock, { status: 201 });
  } catch (error) {
    console.error('Content block creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create content block' },
      { status: 500 }
    );
  }
}
