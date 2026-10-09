/**
 * Normalizes image URLs returned by the backend.
 *
 * The API (hosted on Windows/IIS) sometimes builds URLs with Windows path separators, e.g.
 *   https://zadacademy.runasp.net\Images/Course/default-course-card-image.jpg
 *
 * Browsers and the local `next dev` optimizer silently convert `\` to `/`, but the Vercel
 * image optimizer rejects such URLs with `400 INVALID_IMAGE_OPTIMIZE_REQUEST`, so images
 * appear in development and break in production.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  return url.trim().replace(/\\/g, '/').replace(/%5C/gi, '/');
}
