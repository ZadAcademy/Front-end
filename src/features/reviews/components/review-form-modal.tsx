'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';

import { reviewSchema, ReviewFormValues } from '../lib/schemas/reviews-schemas';
import { CourseReviewResponse } from '../lib/types/reviews';
import { useCreateReviewMutation, useUpdateReviewMutation } from '../hooks/use-reviews-api';
import StarRating from './star-rating';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  existingReview?: CourseReviewResponse | null;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  courseId,
  existingReview,
}: ReviewFormModalProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (existingReview) {
      reset({
        rating: existingReview.rating,
        comment: existingReview.comment || '',
      });
    } else {
      reset({ rating: 0, comment: '' });
    }
  }, [existingReview, reset, isOpen]);

  // Mutations
  const { mutate: createReview, isPending: isCreating } = useCreateReviewMutation(courseId);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReviewMutation(courseId);

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: ReviewFormValues) => {
    if (existingReview) {
      updateReview(
        { reviewId: existingReview.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createReview(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={!isPending ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/5 bg-slate-50/50">
            <h3 className="font-cairo-bold-xl text-greyDark">
              {existingReview 
                ? (isRTL ? 'تعديل التقييم' : 'Edit Review') 
                : (isRTL ? 'إضافة تقييم' : 'Write a Review')}
            </h3>
            <button
              onClick={onClose}
              disabled={isPending}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors focus:outline-none disabled:opacity-50"
            >
              <X className="size-5 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              
              {/* Star Rating Input */}
              <div className="flex flex-col gap-2">
                <label className="font-cairo-bold-base text-greyDark">
                  {isRTL ? 'تقييمك للكورس' : 'Your Rating'} <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      interactive={!isPending}
                      size="lg"
                    />
                  )}
                />
                {errors.rating && (
                  <span className="font-cairo-medium-sm text-red-500">
                    {errors.rating.message}
                  </span>
                )}
              </div>

              {/* Comment Input */}
              <div className="flex flex-col gap-2">
                <label className="font-cairo-bold-base text-greyDark">
                  {isRTL ? 'تعليقك (اختياري)' : 'Your Comment (Optional)'}
                </label>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      value={field.value || ''}
                      disabled={isPending}
                      rows={4}
                      className={`
                        w-full rounded-2xl border bg-slate-50 p-4 font-cairo-medium-sm text-greyDark 
                        focus:outline-none focus:ring-2 focus:ring-blueNormal/20 focus:border-blueNormal 
                        transition-all resize-none
                        ${errors.comment ? 'border-red-500' : 'border-slate-200'}
                      `}
                      placeholder={isRTL ? "شاركنا رأيك في الكورس..." : "Share your thoughts about this course..."}
                    />
                  )}
                />
                {errors.comment && (
                  <span className="font-cairo-medium-sm text-red-500">
                    {errors.comment.message}
                  </span>
                )}
              </div>

            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl font-cairo-bold-base text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-2.5 bg-blueNormal hover:bg-blueNormalHover text-white rounded-xl font-cairo-bold-base transition-colors shadow-lg shadow-blueNormal/20 disabled:opacity-70 flex items-center gap-2"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {existingReview 
                  ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') 
                  : (isRTL ? 'نشر التقييم' : 'Submit Review')}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </>
  );
}
