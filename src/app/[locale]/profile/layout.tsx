import AuthNavbar from '@/shared/components/auth-navbar';
import ProfileSidebar from '@/features/profile/components/profile-sidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ─── Authenticated Navigation Bar ─── */}
      <AuthNavbar />

      {/* ─── Page Content ─── */}
      <div className="bg-gray-50 flex flex-col lg:flex-row min-h-screen pt-16">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-e border-black/5 lg:min-h-[calc(100vh-64px)] lg:sticky top-16 lg:overflow-y-auto shadow-sm z-10">
          <ProfileSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-full p-4 sm:p-8 lg:p-12">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
