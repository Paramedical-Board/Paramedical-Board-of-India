import imagekit from '@/lib/imagekit';

// Server-only helpers for announcement PDFs.
// Wraps the existing ImageKit client in lib/imagekit.ts.

// True only for URLs that belong to our ImageKit account
export function isImageKitUrl(url: string): boolean {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (!endpoint) return false;
  return url.startsWith(endpoint.replace(/\/+$/, '') + '/');
}

export async function uploadAnnouncementPdf(
  buffer: Buffer,
  fileName: string
): Promise<{ url: string; fileId: string }> {
  const res = await imagekit.upload({
    file: buffer,
    fileName,
    folder: '/announcements',
    useUniqueFileName: true,
  });
  return { url: res.url, fileId: res.fileId };
}

export async function deleteAnnouncementPdf(fileId: string): Promise<void> {
  await imagekit.deleteFile(fileId);
}
