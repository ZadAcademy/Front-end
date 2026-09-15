import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CheckoutSuccessPageProps {
  params: {
    locale: string;
    courseId: string;
  };
}

export default async function CheckoutSuccessPage({ params }: CheckoutSuccessPageProps) {
  // Await the params in Next.js 15
  const { locale, courseId } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Checkout.receiptUpload');
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-black/5 max-w-lg w-full flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="size-10 text-green-600" />
        </div>
        
        <h1 className="font-cairo-bold-2xl text-green-700 mb-3">
          {t('successTitle', { defaultValue: 'Receipt Sent Successfully' })}
        </h1>
        
        <p className="font-cairo-medium-base text-greyNormal mb-8 leading-relaxed">
          {t('successDescription', { defaultValue: 'Your transfer receipt will be reviewed by the Zad Academy team within 24 hours. You will receive an email upon course activation.' })}
        </p>

        <Link
          href={`/${locale}/courses/${courseId}`}
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blueNormal hover:bg-blueNormalHover text-white font-cairo-bold-lg transition-colors shadow-lg shadow-blueNormal/20 group"
        >
          {isRTL ? <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />}
          {isRTL ? 'العودة إلى الكورس' : 'Back to Course'}
        </Link>
      </div>
    </div>
  );
}
