'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialCard } from '@/shared/components/testimonial-card';
import { useLocale } from 'next-intl';

/* ─── Swiper core styles ─── */
import 'swiper/css';

export interface TestimonialData {
  id: number;
  text: string;
  name: string;
}

interface TestimonialsSwiperProps {
  testimonials: TestimonialData[];
}

/**
 * TestimonialsSwiper — Client component for testimonials carousel.
 * Uses custom navigation arrows matching the experts swiper style.
 */
export default function TestimonialsSwiper({ testimonials }: TestimonialsSwiperProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        speed={750}
        spaceBetween={24}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: '.testimonials-prev',
          nextEl: '.testimonials-next',
        }}
        className="w-full pb-4"
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id} className="h-auto">
            <div className="h-full">
              <TestimonialCard
                id={item.id}
                text={item.text}
                name={item.name}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ─── Custom Navigation Arrows ─── */}
      <div className="flex items-center justify-start gap-3 mt-6 px-2">
        <button className="testimonials-prev w-12 h-12 rounded-full bg-blueNormal/10 hover:bg-blueNormal/20 text-blueNormal flex items-center justify-center transition-colors cursor-pointer z-10">
          <PrevIcon className="size-6" />
        </button>
        <button className="testimonials-next w-12 h-12 rounded-full bg-blueNormal/10 hover:bg-blueNormal/20 text-blueNormal flex items-center justify-center transition-colors cursor-pointer z-10">
          <NextIcon className="size-6" />
        </button>
      </div>
    </div>
  );
}
