import { setRequestLocale } from 'next-intl/server';
import DashboardPostsTable from '@/features/dashboard/posts/components/dashboard-posts-table';

export default async function DashboardPostsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <DashboardPostsTable />
    </div>
  );
}
