'use client';

import { useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { Menu, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onMenuToggle: () => void;
}

/**
 * DashboardNavbar — Top bar for the dashboard layout.
 * Contains: hamburger menu (mobile), title, language toggle, back-to-site link, user avatar.
 */
export default function DashboardNavbar({ onMenuToggle }: NavbarProps) {
  const t = useTranslations('Dashboard.navbar');
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  /* ─── Language toggle ─── */
  const toggleLanguage = useCallback(() => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  }, [locale, router, pathname]);

  /* ─── User initials for avatar ─── */
  const userInitials = session?.user
    ? `${session.user.firstName?.[0] ?? ''}${session.user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-black/10 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6">

        {/* ═══════════ LEFT — Hamburger + Title ═══════════ */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl
                       hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5 text-greyDark" />
          </button>

          <h1 className="font-cairo-semibold-lg text-greyDark hidden sm:block">
            {t('title')}
          </h1>
        </div>

        {/* ═══════════ RIGHT — Actions ═══════════ */}
        <div className="flex items-center gap-2">
          {/* Back to site link */}
          <Link
            href="/home"
            className="flex items-center gap-2 px-3 py-2 rounded-xl
                       text-greyNormal hover:bg-black/5 transition-colors font-cairo-medium-xs"
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:block">{t('backToSite')}</span>
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
                       hover:bg-black/5 transition-colors cursor-pointer
                       bg-transparent border-none"
            aria-label="Toggle language"
          >
            <Globe className="size-4 text-greyNormal" />
            <span className="font-cairo-medium-xs text-greyDark">
              {locale === 'ar' ? 'EN' : 'AR'}
            </span>
          </button>

          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-blueNormal flex items-center justify-center">
            <span className="font-cairo-bold-sm text-white leading-none">
              {userInitials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
