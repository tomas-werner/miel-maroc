import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

// GET - Get homepage configuration
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // For now, return default configuration
    // In a real app, this would be stored in a dedicated table or config
    const config = {
      heroBanner: null,
      featuredProducts: [],
      showCategories: true,
      showReviews: true,
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Homepage config fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage configuration' },
      { status: 500 }
    );
  }
}

// PATCH - Update homepage configuration
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // For now, just return success
    // In a real app, this would be stored in a dedicated table or config
    return NextResponse.json({ success: true, config: body });
  } catch (error) {
    console.error('Homepage config update error:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage configuration' },
      { status: 500 }
    );
  }
}
