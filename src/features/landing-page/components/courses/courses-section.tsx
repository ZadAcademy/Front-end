import { getTranslations } from 'next-intl/server';
import { CourseCard } from '@/shared/components/course-card';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCourses } from '@/features/home/lib/api/courses-api';
import { cookies } from 'next/headers';

/**
 * CoursesSection — Server component for displaying the available courses.
 * Includes a dark banner at the top and a grid of course cards below.
 */
export default async function CoursesSection() {
  const t = await getTranslations('LandingPage.coursesSection');
  const tFilter = await getTranslations('HomePage.filter');

  const getTranslatedLevel = (level: string) => {
    switch (String(level).toLowerCase()) {
      case '0':
      case 'beginner':
        return tFilter('beginner');
      case '1':
      case 'intermediate':
        return tFilter('intermediate');
      case '2':
      case 'advanced':
      case 'expert':
        return tFilter('expert');
      default:
        return level;
    }
  };

  let courses: any[] = [];
  try {
    const res = await fetchCourses({ page: 1, pageSize: 20 });
    // Filter to ensure only courses with canPreview=true are shown on the landing page
    courses = (res.items || []).filter(course => course.canPreview === true).slice(0, 6);
  } catch (error) {
    console.error("Failed to fetch preview courses:", error);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("__Secure-next-auth.session-token")?.value || cookieStore.get("next-auth.session-token")?.value;
  const isAuth = !!token;

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
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  courseId={course.id}
                  level={getTranslatedLevel(course.level)}
                  title={course.title}
                  shortDescription={course.shortDescription}
                  instructorName={course.instructorName}
                  numberOfLessons={course.numberOfLessons}
                  numberOfStudents={course.numberOfStudents}
                  rating={course.rating}
                  courseHours={course.courseHours}
                  price={isAuth ? (course.resolvedPrice?.price ?? course.price ?? undefined) : undefined}
                  discountPrice={isAuth ? (course.resolvedPrice?.discountPrice ?? course.discountPrice ?? undefined) : undefined}
                  currencyCode={isAuth ? course.resolvedPrice?.currencyCode : undefined}
                  isAuth={isAuth}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
