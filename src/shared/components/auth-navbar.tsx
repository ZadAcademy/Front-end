'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Bell, Globe, LogOut, User, LayoutDashboard, ChevronDown, Home, MessageSquare, Compass } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

/* ─── Scroll threshold (px) before navbar turns solid ─── */
const SCROLL_THRESHOLD = 50;

/**
 * AuthNavbar — Shared navbar for authenticated pages.
 * Contains: logo, notification bell, user dropdown menu.
 * The dropdown includes: language toggle, profile, dashboard (admin), logout.
 */
export default function AuthNavbar() {
  const t = useTranslations('HomePage.authNavbar');
  const { data: session, status } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  /* ─── State ─── */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ─── Track scroll to toggle solid background ─── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ─── Close dropdown when clicking outside ─── */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ─── Language toggle ─── */
  const toggleLanguage = useCallback(() => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
    setIsDropdownOpen(false);
  }, [locale, router, pathname]);

  /* ─── Logout handler ─── */
  const handleLogout = useCallback(() => {
    setIsDropdownOpen(false);
    signOut({ callbackUrl: '/login' });
  }, []);

  /* ─── Get user initials for the avatar ─── */
  const userInitials = session?.user
    ? `${session.user.firstName?.[0] ?? ''}${session.user.lastName?.[0] ?? ''}`.toUpperCase()
    : '؟';

  const userName = session?.user
    ? `${session.user.firstName} ${session.user.lastName}`
    : '';

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${isScrolled
          ? 'bg-white/60 backdrop-blur-md border-b border-white/20 shadow-sm'
          : 'bg-white/40 backdrop-blur-sm'
        }
      `}
      aria-label="Authenticated navigation"
    >
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ═══════════ LOGO ═══════════ */}
          <Link href="/" className="shrink-0">
            <span className="font-cairo-bold-2xl text-black cursor-pointer select-none">
              زاد
            </span>
          </Link>

          {/* ═══════════ CENTER — Main Navigation Links ═══════════ */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            {/* ─── Explore / Landing Page Link ─── */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl
                         hover:bg-black/5 transition-colors cursor-pointer
                         ${pathname === '/' ? 'text-blueNormal bg-blueNormal/10' : 'text-greyNormal'}`}
              aria-label={t('explore', { defaultValue: 'Explore' })}
            >
              <Compass className={`size-5 ${pathname === '/' ? 'fill-blueNormal' : ''}`} />
              <span className="hidden sm:block font-cairo-bold-sm">{t('explore', { defaultValue: 'Explore' })}</span>
            </Link>
            {/* ─── Home Link (Authenticated Only) ─── */}
            {status === 'authenticated' && (
              <Link
                href="/home"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl
                           hover:bg-black/5 transition-colors cursor-pointer
                           ${pathname === '/home' ? 'text-blueNormal bg-blueNormal/10' : 'text-greyNormal'}`}
                aria-label={t('home')}
              >
                <Home className={`size-5 ${pathname === '/home' ? 'fill-blueNormal' : ''}`} />
                <span className="hidden sm:block font-cairo-bold-sm">{t('home')}</span>
              </Link>
            )}

            {/* ─── Posts Link ─── */}
            <Link
              href="/posts"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl
                         hover:bg-black/5 transition-colors cursor-pointer
                         ${pathname === '/posts' ? 'text-blueNormal bg-blueNormal/10' : 'text-greyNormal'}`}
              aria-label={t('posts', { defaultValue: 'Posts' })}
            >
              <MessageSquare className={`size-5 ${pathname === '/posts' ? 'fill-blueNormal' : ''}`} />
              <span className="hidden sm:block font-cairo-bold-sm">{t('posts', { defaultValue: 'Posts' })}</span>
            </Link>
          </div>

          {/* ═══════════ RIGHT SIDE — Notifications + User Menu ═══════════ */}
          <div className="flex items-center gap-3">

            {/* ─── Notification Bell & User Dropdown (Auth Only) ─── */}
            {status === 'authenticated' && (
              <>
                {/* ─── Notification Bell ─── */}
                <button
                  className="relative flex items-center justify-center w-10 h-10 rounded-full
                             hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-none"
                  aria-label={t('notifications')}
                >
                  <Bell className="size-5 text-greyDark" />
                  {/* Notification dot indicator */}
                  <span className="absolute top-2 right-2 w-2 h-2 bg-orangeNormal rounded-full" />
                </button>

                {/* ─── User Profile Dropdown ─── */}
                <div className="relative" ref={dropdownRef}>
                  {/* Trigger button — avatar + name + chevron */}
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                               hover:bg-black/5 transition-colors cursor-pointer
                               bg-transparent border-none"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {/* User name — hidden on small screens */}
                    <span className="hidden sm:block font-cairo-medium-sm text-greyDark max-w-[120px] truncate">
                      {userName}
                    </span>
                    {/* User avatar circle */}
                    <div className="w-9 h-9 rounded-full bg-blueNormal flex items-center justify-center">
                      <span className="font-cairo-bold-sm text-white leading-none">
                        {userInitials}
                      </span>
                    </div>
                    <ChevronDown
                      className={`size-4 text-greyNormal transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* ─── Dropdown Menu ─── */}
                  {isDropdownOpen && (
                    <div
                      className="absolute top-full mt-2 end-0 w-56
                                 bg-white rounded-xl shadow-lg border border-black/10
                                 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {/* User info header */}
                      <div className="px-4 py-2 border-b border-black/5">
                        <p className="font-cairo-semibold-sm text-greyDark truncate">{userName}</p>
                        <p className="font-cairo-regular-xs text-greyNormal truncate">
                          {session?.user?.email ?? ''}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        {/* Profile link */}
                        <button
                          onClick={() => { setIsDropdownOpen(false); router.push('/profile'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5
                                     hover:bg-black/5 transition-colors cursor-pointer
                                     bg-transparent border-none text-start"
                        >
                          <User className="size-4 text-greyNormal" />
                          <span className="font-cairo-medium-sm text-greyDark">
                            {t('profile')}
                          </span>
                        </button>
                        
                        {/* Language toggle */}
                        <button
                          onClick={toggleLanguage}
                          className="w-full flex items-center gap-3 px-4 py-2.5
                                     hover:bg-black/5 transition-colors cursor-pointer
                                     bg-transparent border-none text-start"
                        >
                          <Globe className="size-4 text-greyNormal" />
                          <span className="font-cairo-medium-sm text-greyDark">
                            {locale === 'ar' ? 'English' : 'العربية'}
                          </span>
                        </button>


                        {/* Dashboard link — visible for Admin/SuperAdmin */}
                        {(session?.user?.role === 'Admin' || session?.user?.role === 'SuperAdmin') && (
                          <button
                            onClick={() => { setIsDropdownOpen(false); router.push('/dashboard'); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5
                                       hover:bg-black/5 transition-colors cursor-pointer
                                       bg-transparent border-none text-start"
                          >
                            <LayoutDashboard className="size-4 text-greyNormal" />
                            <span className="font-cairo-medium-sm text-greyDark">
                              {t('dashboard')}
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Logout — separated with border */}
                      <div className="border-t border-black/5 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5
                                     hover:bg-red-50 transition-colors cursor-pointer
                                     bg-transparent border-none text-start"
                        >
                          <LogOut className="size-4 text-red-500" />
                          <span className="font-cairo-medium-sm text-red-500">
                            {t('logout')}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
