import { useTranslations } from 'next-intl';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CtaSection() {
  const t = useTranslations('LandingPage.ctaSection');

  return (
    <section id="cta" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        
        {/* Dark Container */}
        <div className="bg-[#212325] rounded-[2rem] p-8 md:p-16 lg:p-20 flex flex-col items-center text-center shadow-xl">
          
          {/* Badge */}
          <div className="bg-[#fcdbc3] text-[#e36a29] font-cairo-bold-lg px-6 py-2 rounded-full flex items-center gap-2 mb-8 border border-[#fbd3b5]">
            <span>{t('badge')}</span>
            <Sparkles className="size-5" />
          </div>

          {/* Title */}
          <h2 className="font-cairo-bold-3xl md:font-cairo-bold-4xl text-white mb-6 max-w-2xl">
            {t('title')}
          </h2>

          {/* Description */}
          <p className="font-cairo-medium-lg text-[#9CA3AF] leading-relaxed max-w-4xl mb-10">
            {t('description')}
          </p>

          {/* Button */}
          <button className="bg-orangeNormal hover:bg-orangeNormal/90 text-white font-cairo-bold-xl px-10 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
            <span>{t('button')}</span>
            <div className="w-6 h-6 rounded-full border-2 border-white/80 flex items-center justify-center">
              {/* Using ChevronLeft which points left (forward in RTL) */}
              <ChevronLeft className="size-4 rtl:block ltr:hidden" strokeWidth={3} />
              <ChevronRight className="size-4 ltr:block rtl:hidden" strokeWidth={3} />
            </div>
          </button>

        </div>
      </div>
    </section>
  );
}
