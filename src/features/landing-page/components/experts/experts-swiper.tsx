'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InstructorCard } from '@/shared/components/instructor-card';
import { useLocale } from 'next-intl';

/* ─── Swiper core styles ─── */
import 'swiper/css';

export interface ExpertData {
  id: number;
  name: string;
  description: string;
  role?: string;
  experience?: string;
}

interface ExpertsSwiperProps {
  experts: ExpertData[];
}

/**
 * ExpertsSwiper — Client component for the expert cards carousel.
 * Uses custom navigation arrows below the swiper.
 */
export default function ExpertsSwiper({ experts }: ExpertsSwiperProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // In RTL: prev goes right, next goes left
  // In LTR: prev goes left, next goes right
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop={true}
        speed={750}
        spaceBetween={24}
        breakpoints={{
          // mobile
          320: { slidesPerView: 1 },
          // tablet
          768: { slidesPerView: 2 },
          // desktop
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: '.experts-prev',
          nextEl: '.experts-next',
        }}
        className="w-full pb-16"
      >
        {experts.map((expert) => (
          <SwiperSlide key={expert.id} className="h-auto">
            <div className="h-full">
              <InstructorCard
                id={expert.id}
                name={expert.name}
                description={expert.description}
                experience={expert.experience}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ─── Custom Navigation Arrows ─── */}
      <div className="flex items-center justify-start gap-3 mt-4 px-2">
        <button className="experts-prev w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer z-10 backdrop-blur-sm">
          <PrevIcon className="size-6" />
        </button>
        <button className="experts-next w-12 h-12 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer z-10 backdrop-blur-sm">
          <NextIcon className="size-6" />
        </button>
      </div>
    </div>
  );
}
