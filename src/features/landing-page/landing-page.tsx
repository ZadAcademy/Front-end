import Navbar from './components/navbar/navbar';
import HeroSection from './components/hero/hero-section';
import NumbersSection from './components/hero/numbers-section';
import CoursesSection from './components/courses/courses-section';
import ExpertsSection from './components/experts/experts-section';
import TestimonialsSection from './components/testimonials/testimonials-section';
import WhyUsSection from './components/why-us/why-us-section';
import FAQSection from './components/faq/faq-section';
import CtaSection from './components/cta/cta-section';
import Footer from './components/footer/footer';

/**
 * LandingPage — Root component for the landing page.
 * Assembles all sections in order.
 * Each section will be added here as we build them.
 */
export default function LandingPage() {
  return (
    <>
      {/* ─── Navigation Bar ─── */}
      <Navbar />
      {/* ─── Hero Section ─── */}
      <HeroSection />

      {/* ─── Numbers / Achievements ─── */}
      <NumbersSection />
      <div className="h-16" />

      {/* ─── Courses Section ─── */}
      <CoursesSection />

      {/* ─── Experts Section ─── */}
      <ExpertsSection />

      {/* ─── Testimonials Section ─── */}
      <TestimonialsSection />

      {/* ─── Why Us Section ─── */}
      <WhyUsSection />

      {/* ─── FAQ Section ─── */}
      <FAQSection />

      {/* ─── CTA Section ─── */}
      <CtaSection />

      {/* ─── Footer ─── */}
      <Footer />
    </>
  );
}