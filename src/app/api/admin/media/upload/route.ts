import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/db/prisma';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.userType !== 'admin' && session.user?.userType !== 'moderator')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier transmis' }, { status: 400 });
    }

    // Validate size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Le fichier dépasse la taille maximale autorisée (8 Mo)' },
        { status: 400 }
      );
    }

    // Validate MIME type
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!allowedMime.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format de fichier non supporté. Formats acceptés : JPEG, PNG, WebP, SVG, GIF' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & generate unique name
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const originalExt = path.extname(file.name) || '.webp';
    const baseCleanName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const finalFilename = `${timestamp}-${randomSuffix}-${baseCleanName}${originalExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, finalFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${finalFilename}`;

    // Optionally save in database if reachable
    let mediaRecord = null;
    try {
      mediaRecord = await prisma.mediaAsset.create({
        data: {
          url: publicUrl,
          filename: finalFilename,
          altText: altText || file.name,
          size: file.size,
          mimeType: file.type,
        },
      });
    } catch (dbErr) {
      console.warn('Media record not saved to DB (database might be disconnected):', dbErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      size: file.size,
      mimeType: file.type,
      id: mediaRecord?.id || null,
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du téléversement du média' },
      { status: 500 }
    );
  }
}
