'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { getAmbassadorTypeConfig } from '@/features/dashboard/ambassadors/lib/constants/ambassador-types-config';
import { useAmbassadorProgramsQuery } from '../hooks/use-ambassador-programs';
import { AmbassadorProgram } from '../lib/types';
import DiscountRequestForm from './discount-request-form';

interface AmbassadorProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courseTitle?: string;
}

export default function AmbassadorProgramsModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
}: AmbassadorProgramsModalProps) {
  const t = useTranslations('AmbassadorPrograms');
  const tTypes = useTranslations('Dashboard.ambassadors.types');
  const { data, isLoading, isError } = useAmbassadorProgramsQuery();

  const [selectedProgram, setSelectedProgram] = useState<AmbassadorProgram | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProgram(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rangeLabel = (p: AmbassadorProgram) => {
    if (p.minItems != null && p.maxItems != null) return t('range', { min: p.minItems, max: p.maxItems });
    if (p.minItems != null) return t('minOnly', { min: p.minItems });
    if (p.maxItems != null) return t('maxOnly', { max: p.maxItems });
    return t('anyItems');
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 sm:pt-22 pb-6 px-3 sm:px-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-110px)] sm:max-h-[84vh] my-auto border border-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {selectedProgram ? (
          <div className="flex flex-col h-full overflow-hidden">
            <DiscountRequestForm
              program={selectedProgram}
              courseId={courseId}
              courseTitle={courseTitle}
              onBack={() => setSelectedProgram(null)}
              onCloseModal={onClose}
            />
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blueNormal via-indigo-600 to-blue-700 text-white p-5 sm:p-6 shrink-0">
              <div className="pointer-events-none absolute -top-10 -end-10 size-36 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-12 start-10 size-28 rounded-full bg-white/10" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label={t('close')}
                className="absolute top-4 end-4 z-20 size-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
              >
                <X className="size-4" />
              </button>
              <div className="relative flex items-center gap-3.5 pe-8">
                <div className="size-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-cairo-bold-xl sm:font-cairo-bold-2xl text-white truncate leading-tight">
                    {t('modalTitle')}
                  </h2>
                  <p className="font-cairo-regular-xs sm:font-cairo-regular-sm text-white/80 truncate mt-0.5">
                    {t('modalSubtitle')}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
              {isLoading && (
                <div className="flex justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-blueNormal" />
                </div>
              )}
              {isError && <p className="text-center text-red-500 font-cairo-medium-base py-6">{t('error')}</p>}
              {!isLoading && !isError && (!data || data.length === 0) && (
                <p className="text-center text-greyNormal font-cairo-medium-base py-6">{t('empty')}</p>
              )}
              {data?.map((program) => {
                const config = getAmbassadorTypeConfig(program.type);
                const Icon = config.icon;
                return (
                  <div
                    key={program.type}
                    onClick={() => setSelectedProgram(program)}
                    className="group relative flex items-center justify-between gap-3 p-4 rounded-2xl border border-black/10 hover:border-blueNormal hover:shadow-lg hover:shadow-blueNormal/5 cursor-pointer transition-all duration-200 bg-white hover:bg-blue-50/20"
                  >
                    {/* Icon + Title + Description */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`size-11 sm:size-12 shrink-0 rounded-2xl flex items-center justify-center ${config.iconClass}`}>
                        <Icon className="size-5 sm:size-6" />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <h3 className="font-cairo-bold-base text-greyDark group-hover:text-blueNormal transition-colors truncate">
                          {tTypes(`${config.key}.name`)}
                        </h3>
                        <p className="font-cairo-regular-xs text-greyNormal line-clamp-1 leading-relaxed">
                          {tTypes(`${config.key}.description`)}
                        </p>
                        <span className="w-fit mt-1 px-2.5 py-0.5 rounded-lg bg-black/5 font-cairo-medium-xs text-greyDarker">
                          {rangeLabel(program)}
                        </span>
                      </div>
                    </div>

                    {/* Discount Badge + Chevron */}
                    <div className="flex items-center gap-2 shrink-0 ms-2">
                      <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 font-cairo-bold-sm whitespace-nowrap">
                        {Number(program.percent)}% {t('off')}
                      </div>
                      <ChevronLeft className="size-5 text-greyNormal/60 group-hover:text-blueNormal rtl:rotate-0 ltr:rotate-180 transition-transform shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
