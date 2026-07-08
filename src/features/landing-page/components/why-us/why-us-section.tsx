import { useTranslations } from 'next-intl';
import { Award, Presentation } from 'lucide-react';

/**
 * WhyUsSection — Server component for the "Why Us" section.
 * Bento grid layout matching the design:
 *   Row 1: 3 equal text cards (icon + title + description)
 *   Row 2: 1 image card (book) + 1 wide card spanning 2 cols (certificate text + image)
 */
export default function WhyUsSection() {
  const t = useTranslations('LandingPage.whyUsSection');

  return (
    <section id="why-us" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header ─── */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-cairo-bold-5xl text-black">
            {t('title')}
          </h2>
        </div>

        {/* ═══════════════════════════════════ BENTO GRID ═══════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ────────────────────── ROW 1: Three equal text cards ────────────────────── */}

          {/* Card 1: Certificate (rightmost in RTL) */}
          <div className="bg-[#F0F4F8] rounded-3xl p-6 lg:p-8 flex flex-col border border-blueNormal/10">
            <div className="flex justify-start mb-5">
              <div className="w-12 h-12 rounded-xl bg-orangeNormal flex items-center justify-center">
                <Award className="size-6 text-white" />
              </div>
            </div>
            <h3 className="font-cairo-bold-xl text-black mb-2">
              {t('cards.certificate.title')}
            </h3>
            <p className="font-cairo-medium-base text-black/60 leading-relaxed">
              {t('cards.certificate.description')}
            </p>
          </div>

          {/* Card 2: Expert (middle in RTL) */}
          <div className="bg-[#F0F4F8] rounded-3xl p-6 lg:p-8 flex flex-col border border-blueNormal/10">
            <div className="flex justify-start mb-5">
              <div className="w-12 h-12 rounded-xl bg-orangeNormal flex items-center justify-center">
                <Presentation className="size-6 text-white" />
              </div>
            </div>
            <h3 className="font-cairo-bold-xl text-black mb-2">
              {t('cards.expert.title')}
            </h3>
            <p className="font-cairo-medium-base text-black/60 leading-relaxed">
              {t('cards.expert.description')}
            </p>
          </div>

          {/* Card 3: Expert (leftmost in RTL) */}
          <div className="bg-[#F0F4F8] rounded-3xl p-6 lg:p-8 flex flex-col border border-blueNormal/10">
            <div className="flex justify-start mb-5">
              <div className="w-12 h-12 rounded-xl bg-orangeNormal flex items-center justify-center">
                <Presentation className="size-6 text-white" />
              </div>
            </div>
            <h3 className="font-cairo-bold-xl text-black mb-2">
              {t('cards.expert.title')}
            </h3>
            <p className="font-cairo-medium-base text-black/60 leading-relaxed">
              {t('cards.expert.description')}
            </p>
          </div>

          {/* ────────────────────── ROW 2: Image card + Wide card ────────────────────── */}

          {/* Image-only Card: Instruction Manual book (1 col, rightmost in RTL) */}
          <div className="bg-[#F0F4F8] rounded-3xl flex items-center justify-center border border-blueNormal/10 overflow-hidden min-h-[280px]">
            {/* Replace with <Image /> when asset is available */}
            <div className="w-full h-full bg-gradient-to-b from-[#E8EEF4] to-[#D9E3EC] flex items-center justify-center p-8">
              <div className="w-[180px] h-[200px] bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-3 border border-black/5 rotate-[-3deg]">
                <span className="font-cairo-bold-sm text-black/50 uppercase tracking-wider">Instruction</span>
                <span className="font-cairo-bold-sm text-black/50 uppercase tracking-wider">Manual</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="w-8 h-8 bg-blueNormal/10 rounded" />
                  <div className="w-8 h-8 bg-orangeNormal/10 rounded" />
                  <div className="w-8 h-8 bg-orangeNormal/10 rounded" />
                  <div className="w-8 h-8 bg-blueNormal/10 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Wide Card: Certificate (spans 2 cols, middle+left in RTL) */}
          <div className="bg-[#F0F4F8] rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row lg:col-span-2 border border-blueNormal/10 overflow-hidden min-h-[280px] relative">
            {/* Text content */}
            <div className="flex flex-col flex-1 z-10">
              <div className="flex justify-start mb-5">
                <div className="w-12 h-12 rounded-xl bg-orangeNormal flex items-center justify-center">
                  <Award className="size-6 text-white" />
                </div>
              </div>
              <h3 className="font-cairo-bold-xl text-black mb-2">
                {t('cards.certificate.title')}
              </h3>
              <p className="font-cairo-medium-base text-black/60 leading-relaxed max-w-md">
                {t('cards.certificate.description')}
              </p>
            </div>

            {/* Certificate image placeholder */}
            <div className="mt-6 lg:mt-0 flex items-end justify-center lg:justify-end lg:w-[45%] shrink-0">
              <div className="w-[200px] h-[180px] bg-white rounded-lg shadow-md flex flex-col items-center justify-center gap-2 border border-black/5 p-4">
                <span className="font-cairo-bold-lg text-black/40 uppercase tracking-wider border-b-2 border-orangeNormal/30 pb-1">Certification</span>
                <div className="flex gap-2 mt-2">
                  <div className="w-10 h-14 bg-blueNormal/10 rounded-full" />
                  <div className="w-10 h-14 bg-orangeNormal/10 rounded-full" />
                </div>
                <div className="w-16 h-[2px] bg-black/10 mt-1" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
