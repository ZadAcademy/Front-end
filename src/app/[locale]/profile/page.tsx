import { setRequestLocale } from 'next-intl/server';
import ProfilePage from '@/features/profile/components/profile-page';

export default async function ProfilePageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  
  return <ProfilePage />;
}
