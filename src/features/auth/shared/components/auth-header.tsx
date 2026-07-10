'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';

export default function AuthHeader() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = useCallback(() => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  }, [locale, router, pathname]);

  return (
    <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-greyDarker hover:bg-black/5 transition-colors cursor-pointer font-cairo-semibold-sm bg-white shadow-sm border border-gray-100"
      >
        {locale === 'ar' ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
        <span className="hidden sm:inline">{locale === 'ar' ? 'الرئيسية' : 'Home'}</span>
      </button>

      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-greyDarker hover:bg-black/5 transition-colors cursor-pointer font-cairo-semibold-sm bg-white shadow-sm border border-gray-100"
        aria-label="Toggle language"
      >
        <Globe className="size-5" />
        <span className="hidden sm:inline">{locale === 'ar' ? 'English' : 'العربية'}</span>
      </button>
    </header>
  );
}
