import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];

// docType -> max file size in bytes
const MAX_SIZES: Record<string, number> = {
  photo: 200 * 1024,          // 200 KB
  signature: 200 * 1024,      // 200 KB
  aadhaar: 2 * 1024 * 1024,   // 2 MB
  marksheet_10th: 2 * 1024 * 1024,
  marksheet_12th: 2 * 1024 * 1024,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const docType = formData.get('docType') as string | null;

    if (!file || !docType) {
      return NextResponse.json({ error: 'Missing file or docType' }, { status: 400 });
    }

    if (!MAX_SIZES[docType]) {
      return NextResponse.json({ error: 'Invalid docType' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG/JPEG files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZES[docType]) {
      const maxKB = MAX_SIZES[docType] / 1024;
      return NextResponse.json(
        { error: `File too large. Max size is ${maxKB} KB` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `${docType}_${Date.now()}.jpg`,
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
