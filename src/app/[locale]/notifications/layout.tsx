import AuthNavbar from '@/shared/components/auth-navbar';

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthNavbar />
      {children}
    </>
  );
}
