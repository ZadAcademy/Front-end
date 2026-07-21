export interface CourseSection {
  id: number;
  title: string;
  lecturesCount: number;
  totalTime: string;
  lectures: {
    id: number;
    title: string;
    duration: string;
  }[];
}

export interface CourseDetailsApiResponse {
  id: number;
  category: string;
  title: string;
  description: string;
  lecturer: string;
  level: string;
  lastUpdated: string;
  certificate: boolean;
  rating: number;
  studentsCount: number;
  whatYouWillLearn: string;
  skills: string[];
  requirements: string[];
  syllabus: CourseSection[];
}

/**
 * fetchCourseDetails — API service function for fetching a single course.
 *
 * TODO: When the API is ready, replace the dummy implementation below
 * with a real fetch call using the courseId.
 *
 * Example real implementation:
 * ```ts
 * const res = await fetch(`${API_BASE}/api/v1/courses/${courseId}`);
 * return res.json();
 * ```
 */

/* ─── Dummy data for now ─── */
const DUMMY_COURSE_DETAILS: CourseDetailsApiResponse = {
  id: 1,
  category: '#Beginner',
  title: 'معسكر تدريبي شامل في مجال تعلم الآلة وعلوم البيانات',
  description: 'أتقن تعلم الآلة وعلوم البيانات باستخدام لغة بايثون، ابن مشاريع واقعية وتعلم خوارزميات تعلم الآلة من الصفر.',
  lecturer: 'م/ حليم',
  level: 'مستوى متوسط',
  lastUpdated: '12 ديسمبر',
  certificate: true,
  rating: 4.8,
  studentsCount: 2512,
  whatYouWillLearn: 'تغطي هذه الدورة التدريبية المتكاملة كل شيء بدءًا من الأساسيات وصولاً إلى المفاهيم المتقدمة في مجال تعلم الآلة وعلوم البيانات. ستتعلم لغة بايثون، Pandas، NumPy، Scikit-learn، TensorFlow، وغيرها، ثم بناء ملف أعمال يتضمن مشاريع واقعية، بما في ذلك التعرف على الصور، وتحليل المشاعر، والنماذج التنبؤية، مما يعدك لتصبح عالم بيانات ومهندس تعلم آلة معتمد محترف في تخصصك.',
  skills: [
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
    'إتقان لغة بايثون لعلوم البيانات',
  ],
  requirements: [
    'معرفة أساسية ببرمجة بايثون',
    'معرفة أساسية ببرمجة بايثون',
    'معرفة أساسية ببرمجة بايثون',
    'معرفة أساسية ببرمجة بايثون',
  ],
  syllabus: [
    {
      id: 1,
      title: 'Python for Data Science',
      lecturesCount: 25,
      totalTime: '4h 30m',
      lectures: [
        { id: 101, title: 'Setup', duration: '40m' },
        { id: 102, title: 'Setup', duration: '40m' },
        { id: 103, title: 'Setup', duration: '40m' },
      ],
    },
    {
      id: 2,
      title: 'Unsupervised Learning',
      lecturesCount: 35,
      totalTime: '6h 45m',
      lectures: [
        { id: 201, title: 'Setup', duration: '40m' },
        { id: 202, title: 'Setup', duration: '40m' },
      ],
    },
    {
      id: 3,
      title: 'Supervised Learning',
      lecturesCount: 45,
      totalTime: '8h 20m',
      lectures: [
        { id: 301, title: 'Setup', duration: '40m' },
      ],
    },
    {
      id: 4,
      title: 'Data Preprocessing',
      lecturesCount: 30,
      totalTime: '5h 15m',
      lectures: [
        { id: 401, title: 'Setup', duration: '40m' },
      ],
    },
    {
      id: 5,
      title: 'Real-world Projects',
      lecturesCount: 135,
      totalTime: '20h 40m',
      lectures: [
        { id: 501, title: 'Setup', duration: '40m' },
        { id: 502, title: 'Setup', duration: '40m' },
        { id: 503, title: 'Setup', duration: '40m' },
      ],
    },
  ],
};

export async function fetchCourseDetails(courseId: string): Promise<CourseDetailsApiResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Return dummy data for now
  return { ...DUMMY_COURSE_DETAILS, id: Number(courseId) };
}
