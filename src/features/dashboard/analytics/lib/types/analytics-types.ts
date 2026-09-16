// ─── Analytics API Response Types ───
// These types match the shapes returned by the /api/Analytics/* endpoints.

/**
 * GET /api/Analytics/overview
 * Headline counters for the dashboard.
 */
export interface OverviewData {
  totalUsers: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
}

/**
 * GET /api/Analytics/enrollments-over-time
 * A single data point in the daily enrollment series.
 */
export interface EnrollmentDataPoint {
  date: string;   // ISO date string e.g. "2025-09-10"
  count: number;  // enrollment count for that day (0 when none)
}

/**
 * GET /api/Analytics/top-courses
 * A course entry ranked by enrollment count.
 */
export interface TopCourseEntry {
  courseId: string;
  courseTitle: string;
  enrollmentCount: number;
}

/**
 * GET /api/Analytics/orders-summary
 * Order counts by status plus the acceptance rate.
 */
export interface OrdersSummaryData {
  pending: number;
  accepted: number;
  denied: number;
  total: number;
  acceptanceRate: number; // percentage 0-100
}
