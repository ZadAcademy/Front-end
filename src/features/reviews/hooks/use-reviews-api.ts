'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';

import {
  getCourseReviews,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
} from '../api/reviews-api';
import {
  CreateReviewRequest,
  GetCourseReviewsQueryParams,
  UpdateReviewRequest,
} from '../lib/types/reviews';

const REVIEWS_QUERY_KEY = 'course-reviews';
const MY_REVIEW_QUERY_KEY = 'my-course-review';

// Helper to unwrap server action responses that return { serverError: string }
const unwrap = async <T>(promise: Promise<T | { serverError: string }>): Promise<T> => {
  const res = await promise;
  if (res && typeof res === 'object' && 'serverError' in res) {
    throw new Error(res.serverError as string);
  }
  return res as T;
};

// ─── 1. Query: Get Course Reviews ───
export function useCourseReviewsQuery(courseId: string, params: GetCourseReviewsQueryParams) {
  return useQuery({
    queryKey: [REVIEWS_QUERY_KEY, courseId, params],
    queryFn: () => unwrap(getCourseReviews(courseId, params)),
    enabled: !!courseId,
  });
}

// ─── 2. Query: Get My Review ───
export function useMyReviewQuery(courseId: string) {
  return useQuery({
    queryKey: [MY_REVIEW_QUERY_KEY, courseId],
    queryFn: () => unwrap(getMyReview(courseId)),
    enabled: !!courseId,
  });
}

// ─── 3. Mutation: Create Review ───
export function useCreateReviewMutation(courseId: string) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const isAr = locale === 'ar';

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => unwrap(createReview({ courseId, data })),
    onSuccess: () => {
      toast.success(isAr ? 'تم نشر التقييم بنجاح!' : 'Review submitted successfully!');
      // Invalidate queries so the list updates
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, courseId] });
      queryClient.invalidateQueries({ queryKey: [MY_REVIEW_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      let errorMessage = error?.message;
      if (isAr && errorMessage) {
        const lowerMsg = errorMessage.toLowerCase();
        if (lowerMsg.includes('enroll') || lowerMsg.includes('purchase')) {
          errorMessage = 'يجب عليك الاشتراك في الكورس أولاً لتتمكن من إضافة تقييم.';
        } else if (lowerMsg.includes('already') || lowerMsg.includes('exist')) {
          errorMessage = 'لقد قمت بإضافة تقييم لهذا الكورس مسبقاً.';
        }
      }
      toast.error(errorMessage || (isAr ? 'حدث خطأ أثناء إرسال التقييم' : 'An error occurred while submitting review'));
    },
  });
}

// ─── 4. Mutation: Update Review ───
export function useUpdateReviewMutation(courseId: string) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const isAr = locale === 'ar';

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: UpdateReviewRequest }) =>
      unwrap(updateReview({ courseId, reviewId, data })),
    onSuccess: () => {
      toast.success(isAr ? 'تم تحديث التقييم بنجاح!' : 'Review updated successfully!');
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, courseId] });
      queryClient.invalidateQueries({ queryKey: [MY_REVIEW_QUERY_KEY, courseId] });
    },
    onError: (error: any) => {
      let errorMessage = error?.message;
      if (isAr && errorMessage) {
        const lowerMsg = errorMessage.toLowerCase();
        if (lowerMsg.includes('enroll') || lowerMsg.includes('purchase')) {
          errorMessage = 'يجب عليك الاشتراك في الكورس أولاً لتتمكن من تعديل التقييم.';
        } else if (lowerMsg.includes('not found')) {
          errorMessage = 'التقييم غير موجود.';
        }
      }
      toast.error(errorMessage || (isAr ? 'حدث خطأ أثناء التحديث' : 'An error occurred while updating'));
    },
  });
}

// ─── 5. Mutation: Delete Review ───
export function useDeleteReviewMutation(courseId: string) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const isAr = locale === 'ar';

  return useMutation({
    mutationFn: (reviewId: string) => unwrap(deleteReview({ courseId, reviewId })),
    onSuccess: () => {
      toast.success(isAr ? 'تم حذف التقييم بنجاح!' : 'Review deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY, courseId] });
      // Reset the "my review" cache explicitly
      queryClient.setQueryData([MY_REVIEW_QUERY_KEY, courseId], null);
    },
    onError: (error: any) => {
      let errorMessage = error?.message;
      if (isAr && errorMessage) {
        const lowerMsg = errorMessage.toLowerCase();
        if (lowerMsg.includes('not found')) {
          errorMessage = 'التقييم غير موجود.';
        }
      }
      toast.error(errorMessage || (isAr ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting'));
    },
  });
}
