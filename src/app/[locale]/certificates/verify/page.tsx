import VerifyCertificatePage from '@/features/certificates/verify-certificate-page';
import Navbar from '@/features/landing-page/components/navbar/navbar';
import Footer from '@/features/landing-page/components/footer/footer';

export default function VerifyCertificateRoute() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <VerifyCertificatePage />
      </main>
      <Footer />
    </>
  );
}
