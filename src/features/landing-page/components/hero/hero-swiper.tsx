'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

/* ─── Swiper core styles ─── */
import 'swiper/css';
import 'swiper/css/pagination';
import './hero-swiper.css';

/* ============================================================
   HERO_IMAGES
   Array of images to loop through in the swiper.
   Images should be placed at: public/images/hero/
   ============================================================ */
const HERO_IMAGES = [
  { src: '/images/hero/hero-1.jpg', alt: 'mechanical-engineering-1' },
  { src: '/images/hero/hero-2.jpg', alt: 'mechanical-engineering-2' },
];

/**
 * HeroSwiper — Client component for the image carousel.
 * Separated from the hero section so the rest can stay server-side.
 * Uses Swiper with autoplay loop and pagination bullets.
 */
export default function HeroSwiper() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      loop={true}
      speed={750}
      className="hero-swiper w-full h-full rounded-xl overflow-hidden"
    >
      {HERO_IMAGES.map((image) => (
        <SwiperSlide key={image.alt}>
          <div className="relative w-full aspect-3.5/3">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
