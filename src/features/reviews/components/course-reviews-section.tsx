'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Star, MessageSquarePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';

import {
  useCourseReviewsQuery,
  useMyReviewQuery,
  useDeleteReviewMutation
} from '../hooks/use-reviews-api';
import ReviewCard from './review-card';
import ReviewFormModal from './review-form-modal';
import { CourseReviewResponse } from '../lib/types/reviews';

interface CourseReviewsSectionProps {
  courseId: string;
}


export default function CourseReviewsSection({ courseId }: CourseReviewsSectionProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { status } = useSession();
  const isAuth = status === 'authenticated';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<CourseReviewResponse | null>(null);

  // Queries
  const { data: myReview, isLoading: isMyReviewLoading } = useMyReviewQuery(courseId);
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isFetching
  } = useCourseReviewsQuery(courseId, { page: 1, pageSize: 20 });

  // Mutations
  const { mutate: deleteReview } = useDeleteReviewMutation(courseId);

  // Handlers
  const handleOpenAddModal = () => {
    setReviewToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: CourseReviewResponse) => {
    setReviewToEdit(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    const message = isRTL ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?';
    if (confirm(message)) {
      deleteReview(reviewId);
    }
  };

  // Build the display list — use API data if available, otherwise show dummy
  const apiReviews = reviewsData?.items ?? [];
  const allReviews: CourseReviewResponse[] = [];

  // Put "my review" first if it exists
  if (myReview) {
    allReviews.push(myReview);
  }

  // Add API reviews (skip my review to avoid duplicate)
  const otherApiReviews = apiReviews.filter((r: CourseReviewResponse) => r.id !== myReview?.id);
  allReviews.push(...otherApiReviews);

  // Removed dummy fallback
  const displayReviews = allReviews;

  // Navigation icons (flipped for RTL)
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  const isLoading = isReviewsLoading || isFetching;

  return (
    <section className="w-full">
      {/* ─── Section Header ─── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="font-cairo-bold-2xl text-greyDark">
            {isRTL ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
          </h3>
          <p className="font-cairo-medium-sm text-slate-500">
            {isRTL ? 'آراء الطلاب حول هذا الكورس' : 'What students are saying about this course'}
          </p>
        </div>

        {/* Add Review Button */}
        {isAuth && !isMyReviewLoading && !myReview && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-blueNormal text-white rounded-xl font-cairo-bold-sm hover:bg-blueNormalHover transition-colors shadow-sm cursor-pointer"
          >
            <MessageSquarePlus className="size-5" />
            {isRTL ? 'أضف تقييمك' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* ─── Loading ─── */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-blueNormal/50" />
        </div>
      )}

      {/* ─── Reviews Swiper ─── */}
      {!isLoading && displayReviews.length > 0 && (
        <div className="relative w-full">
          <Swiper
            dir={isRTL ? 'rtl' : 'ltr'}
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            loop={displayReviews.length > 3}
            speed={600}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              prevEl: '.reviews-prev',
              nextEl: '.reviews-next',
            }}
            className="w-full pb-4"
          >
            {displayReviews.map((review) => (
              <SwiperSlide key={review.id} className="h-auto">
                <div className="relative h-full">

                  <ReviewCard
                    review={review}
                    isAuthor={myReview?.id === review.id}
                    onEdit={myReview?.id === review.id ? () => handleOpenEditModal(review) : undefined}
                    onDelete={myReview?.id === review.id ? () => handleDeleteReview(review.id) : undefined}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ─── Custom Navigation Arrows ─── */}
          <div className="flex items-center justify-start gap-3 mt-6">
            <button className="reviews-prev w-11 h-11 rounded-full bg-blueNormal/10 hover:bg-blueNormal/20 text-blueNormal flex items-center justify-center transition-colors cursor-pointer">
              <PrevIcon className="size-5" />
            </button>
            <button className="reviews-next w-11 h-11 rounded-full bg-blueNormal/10 hover:bg-blueNormal/20 text-blueNormal flex items-center justify-center transition-colors cursor-pointer">
              <NextIcon className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Empty State ─── */}
      {!isLoading && displayReviews.length === 0 && (
        <div className="py-16 text-center text-greyNormal bg-gray-50 rounded-2xl border border-black/5 flex flex-col items-center gap-3">
          <Star className="size-10 text-gray-300" />
          <p className="font-cairo-medium-lg">
            {isRTL ? 'لا توجد تقييمات حتى الآن. كن أول من يضيف تقييماً!' : 'No reviews yet. Be the first to write a review!'}
          </p>
        </div>
      )}


      {/* ─── Form Modal ─── */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        existingReview={reviewToEdit}
      />
    </section>
  );
}
