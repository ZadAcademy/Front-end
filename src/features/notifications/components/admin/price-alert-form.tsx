'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BadgeDollarSign, Loader2, Search, ChevronDown, Check } from 'lucide-react';
import { useSendPriceAlertMutation } from '../../hooks/use-admin-notifications-api';
import { useDashboardCourses } from '@/features/dashboard/courses/hooks/use-dashboard-courses';

export default function PriceAlertForm() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const sendMutation = useSendPriceAlertMutation();
  const { courseData, search, handleSearchChange, isLoading } = useDashboardCourses(20); // fetch 20 for dropdown

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const courses = courseData?.items ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    sendMutation.mutate(
      {
        courseId: selectedCourseId.toString(),
        customMessage: customMessage.trim() || null,
      },
      {
        onSuccess: () => {
          setSelectedCourseId(null);
          setSelectedCourseTitle('');
          setCustomMessage('');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
          <BadgeDollarSign className="size-5 text-green-600" />
        </div>
        <h3 className="font-cairo-bold-xl text-greyDark">
          {t('priceAlertTitle', { defaultValue: 'Send Price Alert' })}
        </h3>
      </div>

      {/* Course Search Dropdown */}
      <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
        <label className="font-cairo-bold-sm text-greyDark">
          {t('selectCourse', { defaultValue: 'Select Course' })}
        </label>
        
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between h-11 px-4 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                     cursor-pointer hover:border-black/20 transition-colors"
        >
          <span className={selectedCourseTitle ? "text-greyDarker line-clamp-1" : "text-greyNormal"}>
            {selectedCourseTitle || t('coursePlaceholder', { defaultValue: 'Search and select a course...' })}
          </span>
          <ChevronDown className={`size-4 text-greyNormal transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-black/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-2 border-b border-black/5 flex items-center gap-2 bg-gray-50/50">
              <Search className="size-4 text-greyNormal shrink-0 ms-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('searchCourses', { defaultValue: 'Search courses...' })}
                className="w-full h-8 bg-transparent outline-none font-cairo-medium-sm text-greyDarker"
                autoFocus
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto p-1">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="size-5 animate-spin text-blueNormal mx-auto" />
                </div>
              ) : courses.length === 0 ? (
                <div className="p-4 text-center text-sm font-cairo-medium-sm text-greyNormal">
                  {t('noCoursesFound', { defaultValue: 'No courses found.' })}
                </div>
              ) : (
                courses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSelectedCourseTitle(course.title);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      selectedCourseId === course.id ? 'bg-blueLight/20' : 'hover:bg-black/5'
                    }`}
                  >
                    <span className={`font-cairo-medium-sm line-clamp-1 ${selectedCourseId === course.id ? 'text-blueNormal font-cairo-bold-sm' : 'text-greyDarker'}`}>
                      {course.title}
                    </span>
                    {selectedCourseId === course.id && <Check className="size-4 text-blueNormal shrink-0" />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Message */}
      <div className="flex flex-col gap-1.5">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('customMessage', { defaultValue: 'Custom Message (Optional)' })}
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder={t('customMessagePlaceholder', { defaultValue: 'Add an optional message along with the alert...' })}
          rows={3}
          className="px-4 py-3 rounded-xl border border-black/10 bg-white font-cairo-medium-sm text-greyDarker
                     outline-none focus:border-blueNormal transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={sendMutation.isPending || !selectedCourseId}
        className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white
                   font-cairo-bold-base hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20
                   cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sendMutation.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <BadgeDollarSign className="size-5" />
        )}
        {t('sendAlert', { defaultValue: 'Send Alert' })}
      </button>
    </form>
  );
}
