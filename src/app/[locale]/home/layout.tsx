import AuthNavbar from '@/shared/components/auth-navbar';

/**
 * HomeLayout — Wraps the home page with the authenticated navbar.
 * Later this can be moved to a shared (authenticated) route group.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ─── Authenticated Navigation Bar ─── */}
      <AuthNavbar />

      {/* ─── Page Content ─── */}
      {children}
    </>
  );
}
