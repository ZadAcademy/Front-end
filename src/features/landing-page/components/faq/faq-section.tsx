'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

/**
 * FAQSection — Lightweight FAQ accordion built with plain HTML/CSS.
 * No external UI library — just useState for toggling.
 * Fully supports RTL and LTR layouts.
 */
export default function FAQSection() {
  const t = useTranslations('LandingPage.faqSection');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqIndices = [0, 1, 2, 3];

  return (
    <section id="faq" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background decoration */}
    

      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ─── Header ─── */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-cairo-bold-4xl md:font-cairo-bold-5xl" style={{ color: '#000' }}>
            {t('title')}
          </h2>
        </div>

        {/* ─── Accordion ─── */}
        <div className="max-w-7xl mx-auto flex flex-col gap-5" dir={isRTL ? 'rtl' : 'ltr'}>
          {faqIndices.map((index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md px-6 py-1"
                style={{ transition: 'box-shadow 0.3s ease' }}
              >
                {/* Trigger button */}
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full cursor-pointer bg-transparent border-none py-4 flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-8 h-8 shrink-0 rounded-xl text-white flex items-center justify-center font-cairo-bold-lg"
                      style={{ backgroundColor: '#3A3F46' }}
                    >
                      {index + 1}
                    </span>
                    <span className="font-cairo-bold-lg text-start" style={{ color: '#3A3F46' }}>
                      {t(`items.${index}.question`)}
                    </span>
                  </div>

                  {/* Arrow icon — rotates on open, works in both RTL and LTR */}
                  <ChevronDown
                    className="shrink-0 size-6"
                    strokeWidth={2.5}
                    style={{
                      color: '#3A3F46',
                      transition: 'transform 0.25s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Content panel — uses grid trick for smooth height animation */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.25s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      className="font-cairo-medium-lg leading-relaxed pb-6 pt-2"
                      style={{
                        color: '#6B7280',
                        paddingInlineStart: '3.5rem', /* aligns with text after the number badge */
                      }}
                    >
                      {t(`items.${index}.answer`)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
