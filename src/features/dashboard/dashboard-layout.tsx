'use client';

import { useState } from 'react';
import DashboardSidebar from './components/dashboard-sidebar';
import DashboardNavbar from './components/dashboard-navbar';

/**
 * DashboardLayout — Assembles the ERP-style layout:
 * sidebar (left/right based on locale) + top navbar + main content area.
 * Manages the sidebar open/close state for mobile.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#F0F4F8] via-[#F5F5F5] to-[#E8EEF4]">
      {/* ─── Sidebar ─── */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ─── Main Area (navbar + content) ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ─── Top Navbar ─── */}
        <DashboardNavbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

        {/* ─── Page Content ─── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
