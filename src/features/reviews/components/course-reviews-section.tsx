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

// ─── Dummy data so you can see the cards while the API isn't connected ───
const DUMMY_REVIEWS: CourseReviewResponse[] = [
  {
    id: 'dummy-1',
    courseId: '',
    userId: 'user-1',
    userName: 'أحمد محمود',
    userProfileImageUrl: null,
    rating: 5,
    comment: 'كورس ممتاز جداً! الشرح واضح والتطبيق العملي فادني كتير في شغلي. بصراحة أنصح به أي حد بيبدأ في المجال.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: null,
  },
  {
    id: 'dummy-2',
    courseId: '',
    userId: 'user-2',
    userName: 'سارة خالد',
    userProfileImageUrl: null,
    rating: 4,
    comment: 'محتوى رائع ومنظم، بس كنت أتمنى يكون فيه أمثلة أكتر في الجزء الأخير. بشكل عام تجربة ممتازة.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: null,
  },
  {
    id: 'dummy-3',
    courseId: '',
    userId: 'user-3',
    userName: 'محمد علي',
    userProfileImageUrl: null,
    rating: 5,
    comment: 'من أفضل الكورسات اللي درستها. المدرب عنده أسلوب سهل وبسيط في توصيل المعلومة.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: null,
  },
  {
    id: 'dummy-4',
    courseId: '',
    userId: 'user-4',
    userName: 'فاطمة حسن',
    userProfileImageUrl: null,
    rating: 3,
    comment: 'الكورس كويس بس محتاج تحديث لبعض الأجزاء. الجزء النظري كان أطول من اللازم.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: null,
  },
  {
    id: 'dummy-5',
    courseId: '',
    userId: 'user-5',
    userName: 'يوسف عبدالله',
    userProfileImageUrl: null,
    rating: 5,
    comment: 'استفدت جداً من هذا الكورس. الشهادة كانت إضافة ممتازة لسيرتي الذاتية.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: null,
  },
];

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

  // If no real reviews exist, show dummy data
  const displayReviews = allReviews.length > 0 ? allReviews : DUMMY_REVIEWS;

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
      {!isLoading && (
        <div className="relative w-full">
          <Swiper
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
                  {myReview?.id === review.id && (
                    <div className={`absolute ${isRTL ? '-right-3' : '-left-3'} -top-3 z-10 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-cairo-bold-sm shadow-sm border border-amber-200`}>
                      {isRTL ? 'تقييمك' : 'Your Review'}
                    </div>
                  )}
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

      {/* ─── Empty State (only when API returned nothing and no dummy) ─── */}
      {!isLoading && displayReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-200 border-dashed">
          <Star className="size-14 text-slate-200 mb-4" />
          <p className="font-cairo-medium-lg text-slate-400">
            {isRTL ? 'لا توجد تقييمات حتى الآن' : 'No reviews yet'}
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
