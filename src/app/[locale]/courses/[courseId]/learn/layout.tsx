// ─── Learn Route Layout ───
// Minimal layout for the course learning experience.
// Uses AuthNavbar only (no footer) to maximize viewing space.

import AuthNavbar from '@/shared/components/auth-navbar';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthNavbar />
      {/* The WatchingCoursePage handles its own full-height layout,
          so we just render children directly. */}
      <div className="pt-16">
        {children}
      </div>
    </>
  );
}
