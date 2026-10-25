import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // For NextAuth, we redirect to the NextAuth signout endpoint
  const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/';
  return NextResponse.redirect(
    new URL(`/api/auth/signout?callbackUrl=${encodeURIComponent(returnUrl)}`, request.url),
    { status: 307 }
  );
}
