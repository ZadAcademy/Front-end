'use client';

import { CourseReviewResponse } from '../lib/types/reviews';
import StarRating from './star-rating';
import { useLocale } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import Image from 'next/image';
import { MoreVertical, Edit2, Trash2, Quote } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  review: CourseReviewResponse;
  isAuthor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ReviewCard({ review, isAuthor, onEdit, onDelete }: ReviewCardProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
    locale: locale === 'ar' ? ar : enUS,
  });

  return (
    <div className="h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Quote icon */}
      <Quote className="size-7 text-blueNormal/15 mb-3 rotate-180" />

      {/* Comment */}
      {review.comment && (
        <p className="font-cairo-regular-base text-greyNormal leading-relaxed flex-1 mb-5">
          {review.comment}
        </p>
      )}

      {/* Stars */}
      <div className="mb-4">
        <StarRating value={review.rating} size="sm" />
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="relative size-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
              {review.userProfileImageUrl ? (
                <Image
                  src={review.userProfileImageUrl}
                  alt={review.userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-cairo-bold-sm text-blueNormal bg-blueNormal/10">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-cairo-bold-sm text-greyDark leading-tight">
                {review.userName}
              </span>
              <span className="font-cairo-regular-xs text-slate-400">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Author actions */}
          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
              >
                <MoreVertical className="size-4 text-slate-400" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className={`absolute ${locale === 'ar' ? 'left-0' : 'right-0'} bottom-full mb-1 w-32 bg-white rounded-xl shadow-lg border border-black/5 py-1.5 z-50 flex flex-col`}>
                    <button
                      onClick={() => { setShowMenu(false); onEdit?.(); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 transition-colors font-cairo-medium-sm text-greyDark"
                    >
                      <Edit2 className="size-3.5" />
                      <span>{isRTL ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onDelete?.(); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 transition-colors font-cairo-medium-sm text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                      <span>{isRTL ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
