import { FilterState } from '../../components/course-filter';

/* ─── API response shape (matches the backend contract) ─── */
export interface CourseApiItem {
  id: number;
  category: string;
  title: string;
  description: string;
  lecturer: string;
  stats: {
    users: string;
    hours: string;
    lectures: string;
  };
}

export interface CoursesApiResponse {
  data: CourseApiItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

/* ─── Query params sent to the API ─── */
export interface CoursesQueryParams {
  page: number;
  pageSize: number;
  filters: FilterState;
}

/**
 * fetchCourses — API service function for fetching paginated courses.
 *
 * TODO: When the API is ready, replace the dummy implementation below
 * with a real fetch call. The function signature stays the same.
 *
 * Example real implementation:
 * ```ts
 * const params = new URLSearchParams({
 *   page: String(queryParams.page),
 *   pageSize: String(queryParams.pageSize),
 *   level: queryParams.filters.level,
 *   price: queryParams.filters.price,
 *   rating: String(queryParams.filters.rating),
 * });
 * const res = await fetch(`${API_BASE}/api/v1/courses?${params}`);
 * return res.json();
 * ```
 */

/* ─── Dummy data for now ─── */
const DUMMY_COURSES: CourseApiItem[] = [
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
    category: '#Mechanical Engineering',
    title: 'HVAC System Design & Installation',
    description: 'تعلم تصميم وتركيب أنظمة التكييف والتهوية مع خبراء متخصصين في المجال وتطبيقات عملية حقيقية',
    lecturer: 'محاضر/أحمد',
    stats: { users: '(980)', hours: '38h', lectures: '98 lectures' },
  },
  {
    id: 3,
    category: '#Project Management',
    title: 'PMP Exam Preparation Course',
    description: 'كورس شامل للتحضير لامتحان PMP مع نماذج اختبارات حقيقية وشرح مفصل لكل المحاور',
    lecturer: 'محاضر/محمد',
    stats: { users: '(2,100)', hours: '52h', lectures: '142 lectures' },
  },
  {
    id: 4,
    category: '#Quality Control',
    title: 'Welding Inspection & NDT Methods',
    description: 'تعلم أساليب فحص اللحام والاختبارات غير الإتلافية مع تطبيقات عملية في المواقع الصناعية',
    lecturer: 'محاضر/خالد',
    stats: { users: '(750)', hours: '32h', lectures: '88 lectures' },
  },
  {
    id: 5,
    category: '#Design Engineering',
    title: 'SolidWorks Advanced Modeling',
    description: 'اتقن النمذجة المتقدمة في سوليدووركس من خلال مشاريع حقيقية وتمارين تطبيقية شاملة',
    lecturer: 'محاضر/عمر',
    stats: { users: '(1,500)', hours: '40h', lectures: '110 lectures' },
  },
  {
    id: 6,
    category: '#Construction',
    title: 'Structural Steel Design Fundamentals',
    description: 'أساسيات تصميم الهياكل المعدنية وفقا للكودات العالمية مع أمثلة تطبيقية متنوعة',
    lecturer: 'محاضر/حسن',
    stats: { users: '(640)', hours: '28h', lectures: '76 lectures' },
  },
  {
    id: 7,
    category: '#Piping Engineering',
    title: 'Process Piping Design with Caesar II',
    description: 'تحليل إجهاد الأنابيب وتصميم المسارات باستخدام برنامج Caesar II مع مشاريع عملية',
    lecturer: 'محاضر/ياسر',
    stats: { users: '(890)', hours: '48h', lectures: '128 lectures' },
  },
  {
    id: 8,
    category: '#Safety',
    title: 'OSHA Safety Standards & Compliance',
    description: 'تعلم معايير السلامة المهنية الأمريكية وكيفية تطبيقها في بيئة العمل الهندسية',
    lecturer: 'محاضر/سامي',
    stats: { users: '(1,120)', hours: '25h', lectures: '68 lectures' },
  },
  {
    id: 9,
    category: '#Maintenance',
    title: 'Predictive Maintenance Techniques',
    description: 'تقنيات الصيانة التنبؤية وتحليل الاهتزازات والحرارة للمعدات الصناعية',
    lecturer: 'محاضر/فادي',
    stats: { users: '(560)', hours: '35h', lectures: '92 lectures' },
  },
  {
    id: 10,
    category: '#Artificial Intelligence',
    title: 'Machine Learning for Engineers',
    description: 'مقدمة في التعلم الآلي وتطبيقاته في المجال الهندسي مع مشاريع بايثون عملية',
    lecturer: 'محاضر/رامي',
    stats: { users: '(1,800)', hours: '42h', lectures: '115 lectures' },
  },
  {
    id: 11,
    category: '#Planning',
    title: 'Primavera P6 Project Planning',
    description: 'تخطيط وجدولة المشاريع الهندسية باستخدام بريمافيرا P6 مع تطبيقات عملية',
    lecturer: 'محاضر/طارق',
    stats: { users: '(920)', hours: '30h', lectures: '82 lectures' },
  },
  {
    id: 12,
    category: '#Mechanical Engineering',
    title: 'Finite Element Analysis with ANSYS',
    description: 'تحليل العناصر المحدودة باستخدام ANSYS لحل مشاكل الميكانيكا والحرارة والسوائل',
    lecturer: 'محاضر/مصطفى',
    stats: { users: '(1,350)', hours: '50h', lectures: '138 lectures' },
  },
];

export async function fetchCourses(params: CoursesQueryParams): Promise<CoursesApiResponse> {
  // TODO: Replace with real API call when backend is ready
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { page, pageSize } = params;
  const startIndex = (page - 1) * pageSize;
  const paginatedData = DUMMY_COURSES.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedData,
    totalPages: Math.ceil(DUMMY_COURSES.length / pageSize),
    currentPage: page,
    totalItems: DUMMY_COURSES.length,
  };
}
