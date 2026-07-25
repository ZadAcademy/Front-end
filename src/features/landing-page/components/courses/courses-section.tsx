import { useTranslations } from 'next-intl';
import { CourseCard } from '@/shared/components/course-card';
import Image from 'next/image';
import Link from 'next/link';

/**
 * CoursesSection — Server component for displaying the available courses.
 * Includes a dark banner at the top and a grid of course cards below.
 */
export default function CoursesSection() {
  const t = useTranslations('LandingPage.coursesSection');

  // Hardcoded sample data for the course cards to match the design
  const DUMMY_COURSES = [
    {
      courseId: 1,
      level: '1',
      title: 'Piping Design Using AutoCAD Plant 3D',
      shortDescription: 'كورس من خلاله سوف تتعلم قواعد التصميم والانشاء من خلال مدربين علي مستوي خبره عالية وتطبيق عملي بشكل مباشر',
      instructorName: 'محاضر/عبدالحليم',
      numberOfLessons: 136,
      numberOfStudents: 1250,
      rating: 4.5,
      courseHours: 45,
      price: 99.99,
    },
    {
      courseId: 2,
      level: '2',
      title: 'Advanced React and Next.js Patterns',
      shortDescription: 'Learn advanced techniques for building scalable web applications with React and Next.js.',
      instructorName: 'Jane Doe',
      numberOfLessons: 85,
      numberOfStudents: 3400,
      rating: 4.9,
      courseHours: 32,
      price: 149.99,
    },
    {
      courseId: 3,
      level: '0',
      title: 'Introduction to Artificial Intelligence',
      shortDescription: 'A beginner-friendly introduction to the core concepts of AI and Machine Learning.',
      instructorName: 'John Smith',
      numberOfLessons: 42,
      numberOfStudents: 850,
      rating: 4.7,
      courseHours: 15,
      price: 0,
    },
  ];

  return (
    <section id="courses" className="py-12 lg:py-16">
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">

        {/* ═══════════════════════════════════ TOP BANNER (Dark Grey Background) ═══════════════════════════════════ */}
        <div className="bg-[#1C1C1C] rounded-[24px] overflow-hidden flex flex-col md:flex-row items-center p-4 lg:p-6 gap-8 shadow-md">

          {/* Right side (in RTL) / Text Content */}
          <div className="w-full md:w-4/5 flex flex-col gap-4 text-center md:text-start md:order-1">
            <h2 className="font-cairo-bold-5xl text-white">
              {t('title')}
            </h2>
            <p className="font-cairo-regular-lg text-white/80 leading-relaxed max-w-2xl">
              {t('description')}
            </p>
          </div>

          {/* Left side (in RTL) / Image Placeholder */}
          <div className="w-full md:w-2/6  md:order-2 flex justify-center md:justify-start">
            {/* Replace this div with an actual Image tag when the asset is available */}
            <Image
              src="/images/courses/course-cover.jpg"
              alt="Courses Section"
              width={600}
              height={600}
              className='rounded-2xl'
            />
          </div>
        </div>

        {/* ═══════════════════════════════════ COURSES GRID SECTION ═══════════════════════════════════ */}
        <div className="flex flex-col gap-6">

          {/* Header row: "See more courses" link aligned to end */}
          <div className="flex justify-end">
            <Link href="/home" className="text-blueNormal font-cairo-bold-lg hover:border-b-2 border-blueNormal pb-1 hover:text-blueNormalHover transition-colors cursor-pointer bg-transparent">
              {t('seeMore')}
            </Link>
          </div>

          {/* Grid of Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_COURSES.map((course) => (
              <CourseCard
                key={course.courseId}
                courseId={course.courseId}
                level={course.level}
                title={course.title}
                shortDescription={course.shortDescription}
                instructorName={course.instructorName}
                numberOfLessons={course.numberOfLessons}
                numberOfStudents={course.numberOfStudents}
                rating={course.rating}
                courseHours={course.courseHours}
                price={course.price}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
