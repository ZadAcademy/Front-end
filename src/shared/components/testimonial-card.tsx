import { MessageSquareQuote } from 'lucide-react';
import { TestimonialCardProps } from '../lib/types/testimonial';

export function TestimonialCard({ text, name }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-blueNormal/10 transition-all duration-300 hover:shadow-md h-full cursor-grab">
      {/* ─── Quote Icon ─── */}
      <div className="self-end">
        <div className="w-10 h-10 rounded-lg bg-blueNormal flex items-center justify-center">
          <MessageSquareQuote className="size-5 text-white" />
        </div>
      </div>

      {/* ─── Testimonial Text ─── */}
      <p className="font-cairo-medium-base text-black/80 leading-relaxed flex-1">
        {text}
      </p>

      {/* ─── Student Name ─── */}
      <h4 className="font-cairo-bold-xl text-black mt-auto pt-2">
        {name}
      </h4>
    </div>
  );
}
