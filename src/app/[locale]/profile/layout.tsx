import AuthNavbar from '@/shared/components/auth-navbar';
import ProfileSidebar from '@/features/profile/components/profile-sidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ─── Authenticated Navigation Bar ─── */}
      <AuthNavbar />

      {/* ─── Page Content ─── */}
      <div className="bg-gray-50 flex min-h-screen pt-16">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0 bg-white border-e border-black/5 min-h-[calc(100vh-64px)] sticky top-16 overflow-y-auto shadow-sm z-10">
          <ProfileSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-full p-4 sm:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
