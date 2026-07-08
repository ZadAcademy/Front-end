import { useTranslations } from 'next-intl';
import { CircleChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import HeroSwiper from './hero-swiper';

/**
 * HeroSection — Server component for the hero area.
 * Contains the headline, description, CTA buttons, and the image swiper.
 * The swiper is a separate client component for interactivity.
 * Layout: text on the end side, images on the start side (flips in RTL).
 */
export default function HeroSection() {
  const t = useTranslations('LandingPage.hero');

  return (
    <section id="home" className="py-10 lg:py-16">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
      {/* 
        By using items-stretch and no fixed height, the text block and the 
        image block will automatically stretch to be the exact same height! 
      */}
      <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-4 mt-10">


        {/* ═══════════════════════════════════ TEXT CONTENT (end side — right in LTR, left in RTL) ═══════════════════════════════════ */}
        {/* TEXT CARD: full width on mobile, 7/12 on desktop, full height only on desktop */}
        <div className="w-full lg:w-7/12 flex flex-col lg:gap-10 gap-4 bg-blueLightHover border border-white rounded-[16px] p-4 pt-2">
          <div className="flex flex-col gap-6  ">

            {/* ─── Main heading ─── */}
            <h1 className="font-cairo-regular-4xl xl:font-cairo-regular-5xl lg:font-cairo-regular-5xl leading-tight">
              {t('title')}{' '}<br/>
              {/* Highlighted words in orange */}
              <span className="text-orangeNormal">{t('highlight')}</span>
            </h1>

            {/* ─── Description paragraph ─── */}
            <p className="font-cairo-regular-lg text-greyNormal leading-relaxed max-w-xl">
              {t('description')}
            </p>
          </div>

          {/* ─── CTA Buttons ─── */}
          <div className="flex flex-wrap items-center gap-4  ">

            {/* Secondary CTA — Start Now */}
            <Button
              variant="outline"
              size="lg"
              className="font-cairo-semibold-sm text-black bg-transparent border-black rounded-lg px-6 cursor-pointer"
            >
              {t('startNow')}
              <CircleChevronRight className="size-5" />
            </Button>
            {/* Primary CTA — Browse Courses */}
            <Button
              variant="primary"
              size="lg"
              className="font-cairo-semibold-sm text-white rounded-lg px-6 cursor-pointer"
            >
              {t('browseCourses')}
            </Button>
          </div>
        </div>
        {/* ═══════════════════════════════════ IMAGE SWIPER (start side — left in LTR, right in RTL)═══════════════════════════════════ */}

        <div className="w-full lg:w-5/12">
          <HeroSwiper />
        </div>

      </div>
      </div>
    </section>
  );
}
