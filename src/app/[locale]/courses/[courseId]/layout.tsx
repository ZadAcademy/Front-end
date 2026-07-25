import AuthNavbar from '@/shared/components/auth-navbar';
import Footer from '@/features/landing-page/components/footer/footer';

export default function CourseDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthNavbar />
      {/* Course Details pages usually have the header flush with the top, 
          so we let the AuthNavbar sit on top (it's fixed anyway). */}
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
