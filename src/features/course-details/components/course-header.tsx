import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CourseHeaderProps {
  title: string;
  shortDescription: string;
  level: string;
  isRTL: boolean;
  imageUrl: string;
}

export default function CourseHeader({ title, shortDescription, level, isRTL, imageUrl }: CourseHeaderProps) {
  const t = useTranslations('CourseDetails.header');
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="relative w-full min-h-[320px] sm:min-h-[380px] lg:min-h-[450px] overflow-hidden">
      {/* Background Image (Using placeholder for now) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8 h-full flex flex-col pt-20 sm:pt-24 pb-8 sm:pb-12">
        
        {/* Back Button */}
        <Link 
          href="/home"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit"
        >
          <BackIcon className="size-6" />
          <span className="font-cairo-medium-lg">{t('backToCourses')}</span>
        </Link>

        {/* Course Info */}
        <div className="max-w-4xl flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* Badge */}
          <div className="self-start px-3 py-1 bg-blueNormal backdrop-blur-sm text-white font-cairo-semibold-sm rounded-lg border border-white/30">
            {level}
          </div>

          {/* Title — responsive sizing */}
          <h1 className="font-cairo-bold-2xl sm:font-cairo-bold-4xl text-white leading-tight">
            {title}
          </h1>

          {/* Description — full text, no clamp */}
          <p className="font-cairo-medium-base sm:font-cairo-medium-lg text-white/90 leading-relaxed ">
            {shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
