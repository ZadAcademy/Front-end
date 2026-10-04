import NextImage, { type ImageProps } from 'next/image';
import { normalizeImageUrl } from '@/shared/lib/utils/image-url';

/**
 * Drop-in replacement for `next/image` that normalizes backend URLs
 * (e.g. `\` → `/`) so they pass the production (Vercel) image optimizer.
 * Use it exactly like `next/image`: `import Image from '@/shared/ui/app-image'`.
 */
export default function Image({ src, alt, ...props }: ImageProps) {
  const safeSrc = typeof src === 'string' ? normalizeImageUrl(src) : src;
  return <NextImage src={safeSrc} alt={alt} {...props} />;
}
