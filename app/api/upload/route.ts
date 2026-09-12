import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

const DOC_RULES: Record<string, { allowedTypes: string[]; maxSize: number; extension: string }> = {
  photo: { allowedTypes: ['image/jpeg', 'image/jpg'], maxSize: 200 * 1024, extension: 'jpg' },
  signature: { allowedTypes: ['image/jpeg', 'image/jpg'], maxSize: 200 * 1024, extension: 'jpg' },
  aadhaar: { allowedTypes: ['image/jpeg', 'image/jpg'], maxSize: 2 * 1024 * 1024, extension: 'jpg' },
  marksheet_10th: { allowedTypes: ['image/jpeg', 'image/jpg'], maxSize: 2 * 1024 * 1024, extension: 'jpg' },
  marksheet_12th: { allowedTypes: ['image/jpeg', 'image/jpg'], maxSize: 2 * 1024 * 1024, extension: 'jpg' },
  affidavit: { allowedTypes: ['application/pdf'], maxSize: 2 * 1024 * 1024, extension: 'pdf' },
};

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!verifyToken(token)) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const docType = formData.get('docType') as string | null;

    if (!file || !docType) {
      return NextResponse.json({ error: 'Missing file or docType' }, { status: 400 });
    }

    const rule = DOC_RULES[docType];
    if (!rule) {
      return NextResponse.json({ error: 'Invalid docType' }, { status: 400 });
    }

    if (!rule.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for ${docType}` },
        { status: 400 }
      );
    }

    if (file.size > rule.maxSize) {
      const maxKB = rule.maxSize / 1024;
      return NextResponse.json(
        { error: `File too large. Max size is ${maxKB} KB` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `${docType}_${Date.now()}.${rule.extension}`,
      folder: '/paramedical-registrations',
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
