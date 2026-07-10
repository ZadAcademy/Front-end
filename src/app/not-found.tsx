import Link from 'next/link';
import './[locale]/globals.css';
import { Cairo } from 'next/font/google';
import { Button } from '@/shared/ui/button';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo'
});

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="min-h-screen flex flex-col bg-gradient-to-r from-[#CADCEA] via-[#F5F5F5] to-[#D9E6F0] antialiased items-center justify-center p-4">
        
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-16 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 border border-gray-100">
          
          <div className="space-y-4">
            <h1 className="text-[120px] leading-none font-cairo-bold text-orangeNormal drop-shadow-sm">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-cairo-bold-lg text-greyDarker">
              عذراً، الصفحة غير موجودة
            </h2>
          </div>

          <div className="w-16 h-1 bg-orangeNormal mx-auto rounded-full"></div>

          <p className="text-greyNormal font-cairo-medium-lg text-lg leading-relaxed">
            يبدو أن الصفحة التي تبحث عنها غير متوفرة أو تم تغيير الرابط الخاص بها.
            <br className="hidden md:block" />
            تأكد من الرابط أو عُد إلى الصفحة الرئيسية.
          </p>

          <div className="pt-6">
            <Link href="/">
              <Button variant="primary" size="lg" className="px-10 h-14 font-cairo-bold-lg text-lg rounded-xl shadow-md shadow-orange-200 transition-all">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
          
        </div>
        
      </body>
    </html>
  );
}
