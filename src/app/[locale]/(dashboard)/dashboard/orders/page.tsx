import { Metadata } from 'next';
import OrdersList from '@/features/dashboard/orders/components/orders-list';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Dashboard.orders' });

  return {
    title: `${t('title', { defaultValue: 'Orders Management' })} - Zad Academy`,
  };
}

export default function OrdersPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <OrdersList />
    </div>
  );
}
