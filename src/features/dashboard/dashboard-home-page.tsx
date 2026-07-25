
import { useTranslations } from 'next-intl';

/**
 * DashboardHomePage — Placeholder for the dashboard overview/home page.
 * Will be implemented with analytics, stats, and quick actions later.
 */
export default function DashboardHomePage() {
  const t = useTranslations('Dashboard.pages');

  return (
    <div>
      <h1 className="font-cairo-bold-2xl text-greyDark">
        {t('dashboard')}
      </h1>
    </div>
  );
}
