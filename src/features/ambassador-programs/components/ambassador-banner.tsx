'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BadgePercent, ChevronLeft, Sparkles } from 'lucide-react';
import { useAmbassadorProgramsQuery } from '../hooks/use-ambassador-programs';
import AmbassadorProgramsModal from './ambassador-programs-modal';

export default function AmbassadorBanner() {
  const t = useTranslations('AmbassadorPrograms');
  const { data } = useAmbassadorProgramsQuery();
  const [open, setOpen] = useState(false);

  if (!data || data.length === 0) return null;
  const maxPercent = Math.max(...data.map((p) => Number(p.percent)));

  return (
    <>
      <section className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blueNormal via-indigo-600 to-violet-700 text-white shadow-xl shadow-blueNormal/20">
        <div className="pointer-events-none absolute -top-16 -end-16 size-64 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
        <div className="pointer-events-none absolute -bottom-20 start-1/3 size-56 rounded-full bg-orangeNormal/30 blur-3xl" />
        <Sparkles className="pointer-events-none absolute top-5 start-[45%] size-5 text-white/40 animate-pulse" />
        <Sparkles className="pointer-events-none absolute bottom-6 end-[30%] size-4 text-white/30 animate-pulse" />

        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 sm:p-8">
          <div className="shrink-0 flex flex-col items-center justify-center size-32 sm:size-36 rounded-full bg-white/15 backdrop-blur-md ring-4 ring-white/20 animate-[pulse_3s_ease-in-out_infinite]">
            <span className="font-cairo-medium-sm text-white/80">{t('upTo')}</span>
            <span className="font-cairo-bold-3xl leading-none">{maxPercent}%</span>
            <span className="font-cairo-bold-sm text-orange-200">{t('off')}</span>
          </div>

          <div className="flex-1 text-center md:text-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 font-cairo-medium-sm mb-3">
              <BadgePercent className="size-4" />
              {t('badge')}
            </span>
            <h2 className="font-cairo-bold-2xl sm:font-cairo-bold-3xl mb-2">{t('title', { percent: maxPercent })}</h2>
            <p className="font-cairo-regular-base text-white/85 max-w-2xl">{t('subtitle')}</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blueNormal font-cairo-bold-base cursor-pointer shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            {t('cta')}
            <ChevronLeft className="size-5 rtl:rotate-0 ltr:rotate-180" />
          </button>
        </div>
      </section>

      <AmbassadorProgramsModal isOpen={open} onClose={() => setOpen(false)} readOnly={true} />
    </>
  );
}
