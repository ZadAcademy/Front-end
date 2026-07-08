import Navbar from './components/navbar/navbar';
import HeroSection from './components/hero/hero-section';
import NumbersSection from './components/hero/numbers-section';
import CoursesSection from './components/courses/courses-section';
import ExpertsSection from './components/experts/experts-section';

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
            <div className="h-16" />


      {/* Future sections will be added here:
          - Testimonials
          - Why Us
          - FAQ
          - Contact / Footer
      */}
    </>
  );
}