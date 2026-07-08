import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaLinkedin,FaFacebookF  } from "react-icons/fa";
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('LandingPage.footerSection');
  const tNav = useTranslations('LandingPage.navbar');

  return (
    <footer className="w-full bg-greyDarkActive backdrop-blur-xl border-t border-white/50 pt-16 pb-8 relative mt-12">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="text-3xl font-tajawal-bold-3xl text-greyLight flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orangeNormal text-white flex items-center justify-center font-bold">
                Z
              </div>
              أكاديمية زاد
            </Link>
            <p className="font-cairo-medium-base text-greyLight leading-relaxed max-w-sm">
              {t('brandDescription')}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {[FaLinkedin, FaLinkedin,FaFacebookF].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blueNormal hover:bg-orangeNormal hover:text-white transition-colors">
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-cairo-bold-xl text-white">
              {t('quickLinks')}
            </h4>
            <ul className="flex flex-col gap-4 font-cairo-medium-base text-greyLight">
              <li><Link href="#home" className="hover:text-orangeNormal transition-colors">{tNav('home')}</Link></li>
              <li><Link href="#courses" className="hover:text-orangeNormal transition-colors">{tNav('courses')}</Link></li>
              <li><Link href="#experts" className="hover:text-orangeNormal transition-colors">{tNav('experts')}</Link></li>
              <li><Link href="#faq" className="hover:text-orangeNormal transition-colors">{tNav('faq')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="font-cairo-bold-xl text-white">
              {t('contactInfo')}
            </h4>
            <ul className="flex flex-col gap-5 font-cairo-medium-base text-greyLight">
              <li className="flex items-start gap-3">
                <Mail className="size-5 text-orangeNormal shrink-0 mt-0.5" />
                <span>info@zad-academy.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-5 text-orangeNormal shrink-0 mt-0.5" />
                <span dir="ltr">010102233556</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="size-5 text-orangeNormal shrink-0 mt-0.5" />
                <span>مصر</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="font-cairo-bold-xl text-white">
              {t('newsletter')}
            </h4>
            <p className="font-cairo-medium-base text-greyLight">
              {t('newsletterDescription')}
            </p>
            <div className="relative mt-2">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني..." 
                className="w-full bg-white rounded-xl px-4 py-3.5 pe-12 border border-blueNormal/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-orangeNormal/50 font-cairo-medium-base"
              />
              <button className="absolute top-1/2 -translate-y-1/2 end-1.5 w-10 h-10 rounded-lg bg-orangeNormal text-white flex items-center justify-center hover:bg-orangeNormal/90 transition-colors">
                <Send className="size-5 rtl:rotate-180" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-cairo-medium-base text-greyLight">
            {t('rights')}
          </p>
          <div className="flex items-center gap-6 font-cairo-medium-base text-greyLight text-sm">
            <Link href="#" className="hover:text-orangeNormal transition-colors">الشروط والأحكام</Link>
            <Link href="#" className="hover:text-orangeNormal transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
