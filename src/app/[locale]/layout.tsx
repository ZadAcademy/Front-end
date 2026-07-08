import type { Metadata } from "next";
import { Geist, Geist_Mono, Sarabun, Tajawal, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/shared/theme/theme-provider';
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/shared/providers/global/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sarabun = Sarabun({
  subsets: ['latin' , 'thai'],
  weight: ['400', '500' , '600', '700'],
  variable: '--font-sarabun'
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal'

});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo'
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zad-academy",
  description: "A store specializing in selling flowers",
};

interface Props  {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {

 const {locale} = await params;
 if (!hasLocale(routing.locales, locale)) {
   notFound();
 }

 const fontClassSwitches = locale === 'ar' ? tajawal.variable : sarabun.variable ;

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${fontClassSwitches} h-full antialiased`}
    >
      <body suppressHydrationWarning
        className="min-h-full flex flex-col">
       <Providers>
          <ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem disableTransitionOnChange storageKey='theme'>
              {children}
          </ThemeProvider>
       </Providers>
        </body>
    </html>
  );
}
