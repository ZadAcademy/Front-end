'use client';

import { useLocale, useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';

/**
 * FAQSection — Client component for the Frequently Asked Questions section.
 * Uses shadcn Accordion to display Q&A interactively.
 */
export default function FAQSection() {
  const t = useTranslations('LandingPage.faqSection');
  const locale=useLocale();
  const isRTL = locale === 'ar';

  // We read the items array directly from translations
  // Since next-intl doesn't return objects well for arrays in all setups, 
  // we will map over an array of indices or use t.raw if configured.
  // Alternatively, we use a predefined array of keys.
  const faqIndices = [0, 1, 2, 3];

  return (
    <section id="faq" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-blueNormal/5 blur-3xl rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-[300px] bg-orangeNormal/5 blur-3xl rounded-full -z-10 pointer-events-none" />

      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ─── Header ─── */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-cairo-bold-4xl md:font-cairo-bold-5xl text-black">
            {t('title')}
          </h2>
        </div>

        {/* ─── Accordion ─── */}
        <div className="max-w-7xl mx-auto">
          <Accordion dir={isRTL?"rtl":"ltr"} className="w-full flex flex-col gap-5">
            {faqIndices.map((index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border-none shadow-sm transition-all duration-300 hover:shadow-md px-6 py-1"
              >
                <AccordionTrigger className="font-cairo-bold-2xl cursor-pointer text-[#3A3F46] hover:no-underline py-4 flex items-center justify-between [&_svg]:size-6 [&_svg]:text-[#3A3F46] [&_svg]:stroke-2">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 shrink-0 rounded-xl bg-[#3A3F46] text-white flex items-center justify-center font-cairo-bold-xl">
                      {index + 1}
                    </span>
                    <span>{t(`items.${index}.question`)}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="font-cairo-medium-lg text-[#6B7280] leading-relaxed pb-6 pt-2 pl-13 text-right">
                  {t(`items.${index}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
