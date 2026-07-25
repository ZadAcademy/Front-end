import DashboardLayout from '@/features/dashboard/dashboard-layout';

/**
 * (dashboard) route group layout — Wraps all dashboard pages
 * with the sidebar + navbar layout.
 * Uses a route group so the URL stays clean (no "(dashboard)" in the path).
 */
export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
