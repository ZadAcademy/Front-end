import { useTranslations } from 'next-intl';
import ExpertsSwiper from './experts-swiper';

/**
 * ExpertsSection — Server component for the experts/instructors showcase.
 * Features a blue background, centered title/description, and a custom swiper.
 */
export default function ExpertsSection() {
  const t = useTranslations('LandingPage.expertsSection');

  // Hardcoded dummy data for now
  const DUMMY_EXPERTS = [
    {
      id: 1,
      name: 'م/حليم',
      description: t('description'),
      role: t('role'),
      experience: t('experience'),
    },
    {
      id: 2,
      name: 'م/حليم',
      description: t('description'),
      role: t('role'),
      experience: t('experience'),
    },
    {
      id: 3,
      name: 'م/حليم',
      description: t('description'),
      role: t('role'),
      experience: t('experience'),
    },
    {
      id: 4,
      name: 'م/حليم',
      description: t('description'),
      role: t('role'),
      experience: t('experience'),
    }
  ];

  return (
    <section id="experts" className="bg-blueNormal py-6 lg:py-12">
      {/* ─── Global constrained container ─── */}
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <h2 className="font-cairo-bold-5xl text-white">
            {t('title')}
          </h2>
          <p className="font-cairo-regular-lg text-white/90 leading-relaxed max-w-3xl">
            {t('description')}
          </p>
        </div>

        {/* ─── Swiper ─── */}
        <ExpertsSwiper experts={DUMMY_EXPERTS} />

      </div>
    </section>
  );
}
