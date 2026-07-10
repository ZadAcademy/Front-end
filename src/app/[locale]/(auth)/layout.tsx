import AuthHeader from '@/features/auth/shared/components/auth-header';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50/50 pt-20 sm:pt-0">
      <AuthHeader />
      {/* Centered form container for all auth pages */}
      <div className="flex-1 flex items-center justify-center w-full px-4 py-6 sm:py-12">
        {children}
      </div>
    </div>
  );
}
