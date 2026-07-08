import { useTranslations } from 'next-intl';
import TestimonialsSwiper from './testimonials-swiper';

/**
 * TestimonialsSection — Server component for student testimonials.
 * Light background section with centered title/description and a swiper of testimonial cards.
 */
export default function TestimonialsSection() {
  const t = useTranslations('LandingPage.testimonialsSection');

  const DUMMY_TESTIMONIALS = [
    {
      id: 1,
      text: t('sampleText'),
      name: 'Mahmoud Emad',
    },
    {
      id: 2,
      text: t('sampleText'),
      name: 'Mahmoud Emad',
    },
    {
      id: 3,
      text: t('sampleText'),
      name: 'Mahmoud Emad',
    },
    {
      id: 4,
      text: t('sampleText'),
      name: 'Mahmoud Emad',
    },
    {
      id: 5,
      text: t('sampleText'),
      name: 'Mahmoud Emad',
    },
  ];

  return (
    <section id="testimonials" className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <h2 className="font-cairo-bold-5xl text-black">
            {t('title')}
          </h2>
          <p className="font-cairo-regular-lg text-black/70 leading-relaxed max-w-3xl">
            {t('description')}
          </p>
        </div>

        {/* ─── Swiper ─── */}
        <TestimonialsSwiper testimonials={DUMMY_TESTIMONIALS} />

      </div>
    </section>
  );
}
