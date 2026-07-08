import { useTranslations } from 'next-intl';
import { CourseCard } from '@/shared/components/course-card';
import Image from 'next/image';

/**
 * CoursesSection — Server component for displaying the available courses.
 * Includes a dark banner at the top and a grid of course cards below.
 */
export default function CoursesSection() {
  const t = useTranslations('LandingPage.coursesSection');

  // Hardcoded sample data for the course cards to match the design
  const DUMMY_COURSES = [
    {
      id: 1,
      category: '#Artificial Intelligence',
      title: 'Piping Design Using AutoCAD Plant 3D',
      description: 'كورس من خلاله سوف تتعلم قواعد التصميم والانشاء من خلال مدربين علي مستوي خبره عالية وتطبيق عملي بشكل مباشر',
      lecturer: 'محاضر/عبدالحليم',
      stats: { users: '(1,250)', hours: '45h', lectures: '136 lectures' },
    },
    {
      id: 2,
      category: '#Artificial Intelligence',
      title: 'Piping Design Using AutoCAD Plant 3D',
      description: 'كورس من خلاله سوف تتعلم قواعد التصميم والانشاء من خلال مدربين علي مستوي خبره عالية وتطبيق عملي بشكل مباشر',
      lecturer: 'محاضر/عبدالحليم',
      stats: { users: '(1,250)', hours: '45h', lectures: '136 lectures' },
    },
    {
      id: 3,
      category: '#Artificial Intelligence',
      title: 'Piping Design Using AutoCAD Plant 3D',
      description: 'كورس من خلاله سوف تتعلم قواعد التصميم والانشاء من خلال مدربين علي مستوي خبره عالية وتطبيق عملي بشكل مباشر',
      lecturer: 'محاضر/عبدالحليم',
      stats: { users: '(1,250)', hours: '45h', lectures: '136 lectures' },
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
            <button className="text-blueNormal font-cairo-bold-lg border-b-2 border-blueNormal pb-1 hover:text-blueNormalHover transition-colors cursor-pointer bg-transparent">
              {t('seeMore')}
            </button>
          </div>

          {/* Grid of Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DUMMY_COURSES.map((course) => (
              <CourseCard
                key={course.id}
                category={course.category}
                title={course.title}
                description={course.description}
                lecturer={course.lecturer}
                stats={course.stats}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
