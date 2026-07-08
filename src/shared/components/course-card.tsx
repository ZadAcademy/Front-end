import { User, Clock, SquarePlay, Image as ImageIcon } from 'lucide-react';
import { CourseCardProps } from '../lib/types/course';
import Image from 'next/image';


export function CourseCard({
  category,
  title,
  description,
  lecturer,
  stats,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-2.5 flex flex-col  transition-all duration-300 hover:shadow-md">
      {/* ─── Image Placeholder ─── */}
      <div className="w-full aspect-4/3 rounded-xl flex items-center justify-center">
        <Image 
          src="/images/courses/course-cover.jpg"
          alt="Courses Section"
          width={600}
          height={600}
          className='rounded-xl border border-orange-500 '
        />
      </div>

      {/* ─── Content ─── */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Category Badge */}
        <div className="self-start px-3 py-1 bg-blueLight text-blueNormal font-cairo-semibold-sm rounded-lg">
          {category}
        </div>

        {/* Title */}
        <h3 className="font-cairo-bold-xl text-black leading-tight ">
          {title}
        </h3>

        {/* Description */}
        <p className="font-cairo-medium-sm text-black/70 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Lecturer */}
        <div className="flex justify-start mt-auto pt-2">
          <div className="bg-blueNormal text-white font-cairo-medium-sm px-4 py-1.5 rounded-lg ">
            {lecturer}
          </div>
        </div>
      </div>

      {/* ─── Footer Stats ─── */}
      <div className="flex items-center gap-2 pt-4  flex-wrap">
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <User className="size-4" />
          <span className="font-cairo-medium-xs">{stats.users}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <Clock className="size-4" />
          <span className="font-cairo-medium-xs">{stats.hours}</span>
        </div>
        <div className="flex items-center gap-1.5 border border-black/10 rounded-md px-2.5 py-1 text-black/70">
          <SquarePlay className="size-4" />
          <span className="font-cairo-medium-xs">{stats.lectures}</span>
        </div>
      </div>
    </div>
  );
}
