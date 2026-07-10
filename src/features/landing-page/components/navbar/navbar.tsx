'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CircleChevronRight, CirclePlus, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';
import LoginModal from '@/features/auth/login/components/login-modal';
import './navbar.css';

/* ============================================================
   NAV_ITEMS
   Each item maps a translation key to a section ID.
   When clicked, the page smooth-scrolls to the matching <section id="...">.
   ============================================================ */
const NAV_ITEMS = [
  { key: 'home', sectionId: 'home' },
  { key: 'courses', sectionId: 'courses' },
  { key: 'experts', sectionId: 'experts' },
  { key: 'testimonials', sectionId: 'testimonials' },
  { key: 'whyUs', sectionId: 'why-us' },
  { key: 'faq', sectionId: 'faq' },
] as const;

/* ─── Scroll threshold (px) before navbar turns solid ─── */
const SCROLL_THRESHOLD = 50;

export default function Navbar() {
  const t = useTranslations('LandingPage.navbar');

  /* ─── State ─── */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  /* ─── Track scroll to toggle solid background ─── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    // Check initial position (e.g. page refreshed mid-scroll)
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ─── Close mobile menu when resizing to desktop ─── */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ─── Language Toggle ─── */
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = useCallback(() => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  }, [locale, router, pathname]);

  /* ─── Smooth scroll to a section and close mobile menu ─── */
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close the mobile menu after navigation
    setIsMobileMenuOpen(false);
  }, []);

  /* ─── Toggle mobile menu open/close ─── */
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${isScrolled
          ? 'bg-white/60 backdrop-blur-md border-b border-white/20 shadow-sm'
          : 'bg-transparent'
        }
      `}
      aria-label="Main navigation"
    >
      {/* ─── Desktop & Mobile Container ─── */}
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ═══════════════════════════════════
              LOGO
              ═══════════════════════════════════ */}
          <div className="shrink-0">
            <span className="font-cairo-bold-2xl text-black cursor-pointer select-none">
              زاد
            </span>
          </div>

          {/* ═══════════════════════════════════
              DESKTOP NAV LINKS (hidden on mobile)
              ═══════════════════════════════════ */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.sectionId)}
                className="nav-link font-cairo-medium-base text-black  transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                {t(item.key)}
              </button>
            ))}
          </div>

          {/* ═══════════════════════════════════
              RIGHT SIDE ACTIONS (Language + CTA / Mobile Menu)
              ═══════════════════════════════════ */}
          <div className="flex items-center gap-2 lg:gap-4">

            {/* ─── Language Toggle Button (Visible on all devices) ─── */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-black hover:bg-black/5 transition-colors cursor-pointer font-cairo-semibold-sm"
              aria-label="Toggle language"
            >
              <Globe className="size-5" />
              <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* ─── DESKTOP CTA BUTTONS (hidden on mobile) ─── */}
            <div className="hidden lg:flex gap-4 items-center">
              <Button
                variant="primary"
                size="lg"
                className="font-cairo-semibold-sm text-white bg-greyDark hover:bg-greyDarker rounded-lg px-4 cursor-pointer"
                onClick={() => setIsLoginModalOpen(true)}
              >
                {t('login')}
                <CircleChevronRight />
              </Button>

              <Button
                variant="primary"
                size="lg"
                className=" font-cairo-semibold-sm text-white rounded-lg px-4 cursor-pointer"
                onClick={() => scrollToSection('contact')}
              >
                {t('create-account')}
                <CirclePlus />
              </Button>
            </div>

            {/* ─── MOBILE MENU TOGGLE (hidden on desktop) ─── */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-black hover:bg-black/5 transition-colors duration-200 cursor-pointer bg-transparent border-none"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          MOBILE MENU (dropdown)
          Only rendered when open.
          ═══════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mobile-menu-enter bg-white/95 backdrop-blur-md border-t border-black/5 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.sectionId)}
                className="nav-link w-full text-start font-cairo-medium-base text-black hover:bg-black/5 rounded-lg px-4 py-3 transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                {t(item.key)}
              </button>
            ))}

            {/* ─── Mobile CTA Buttons (same style as desktop) ─── */}
            <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-black/10">
              <Button
                variant="primary"
                size="lg"
                className="w-full font-cairo-semibold-sm text-white bg-greyDark hover:bg-greyDarker rounded-lg px-4 cursor-pointer"
                onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }}
              >
                {t('login')}
                <CircleChevronRight />
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="w-full font-cairo-semibold-sm text-white rounded-lg px-4 cursor-pointer"
                onClick={() => scrollToSection('contact')}
              >
                {t('create-account')}
                <CirclePlus />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Login Modal ─── */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}
