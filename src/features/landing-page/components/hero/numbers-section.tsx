import { useTranslations } from 'next-intl';

/**
 * NumbersSection — Server component for the achievements/stats bar.
 * Displays key metrics (students, topics, courses) in a horizontal row.
 * Full-width dark blue background with white text.
 */
export default function NumbersSection() {
  const t = useTranslations('LandingPage.numbers');

  /* ─── Stats data — maps translation keys to display ─── */
  const stats = [
    { countKey: 'studentsCount', labelKey: 'students' },
    { countKey: 'topicsCount', labelKey: 'topics' },
    { countKey: 'coursesCount', labelKey: 'courses' },
  ] as const;

  return (
    <section className="bg-blueNormal rounded-2xl py-2 px-2 lg:px-3 lg:py-4 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.labelKey} className="flex flex-col items-center gap-1">
            {/* ─── Number ─── */}
            <span className="font-cairo-medium-4xl lg:font-cairo-bold-5xl text-white">
              {t(stat.countKey)}
            </span>
            {/* ─── Label ─── */}
            <span className="font-cairo-medium-lg lg:font-cairo-bold-4xl text-white">
              {t(stat.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
