'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, ArrowRight, ArrowLeft, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetMyPaymentMethodsQuery } from '@/features/dashboard/payment-methods/hooks/use-payment-methods-api';
import { useCourseDetails } from '@/features/course-details/hooks/use-course-details';
import { useEnrollmentStatusQuery } from '@/features/course-details/hooks/use-enrollment';
import PaymentMethodCard from './components/payment-method-card';
import ReceiptUploadForm from './components/receipt-upload-form';
import { useRouter } from 'next/navigation';

interface CheckoutPageProps {
  courseId: string;
}

export default function CheckoutPage({ courseId }: CheckoutPageProps) {
  const t = useTranslations('Checkout');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  
  const { data: paymentMethods = [], isLoading: isLoadingMethods } = useGetMyPaymentMethodsQuery();
  const { data: course, isLoading: isLoadingCourse } = useCourseDetails(courseId);
  const { data: enrollment, isLoading: isEnrollmentLoading } = useEnrollmentStatusQuery(courseId);

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  if (enrollment?.data?.status === 'Enrolled' || enrollment?.data?.status === 'PendingOrder') {
    // Avoid rendering the checkout if already enrolled or pending. 
    // They shouldn't be here. Redirect back to course page.
    router.replace(`/${locale}/courses/${courseId}`);
    return null;
  }

  if (isLoadingCourse || isLoadingMethods || isEnrollmentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-10 animate-spin text-blueNormal" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <p className="font-cairo-medium-xl text-red-500">{t('courseNotFound', { defaultValue: 'Course not found' })}</p>
        <Link href="/courses" className="text-blueNormal underline font-cairo-medium-base">{t('backToCourses', { defaultValue: 'Back to courses' })}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-16 lg:pt-20">
      
      {/* ─── Header & Stepper ─── */}
      <div className="bg-white border-b border-black/5 pt-8 pb-12 mb-8">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="font-cairo-bold-3xl text-[#1a1a2e] mb-2">{t('completeSubscription', { defaultValue: 'Complete Subscription' })}</h1>
          <p className="font-cairo-medium-base text-greyNormal mb-12">{t('completeSteps', { defaultValue: 'Complete the following steps to activate your subscription in the course' })}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-greyNormal hover:text-blueNormal transition-colors font-cairo-medium-sm mb-6 bg-white px-4 py-2 rounded-lg border border-black/5 shadow-sm group"
        >
          <ArrowLeft className="size-4 rtl:hidden group-hover:-translate-x-1 transition-transform" />
          <ArrowRight className="size-4 hidden rtl:block group-hover:translate-x-1 transition-transform" />
          {t('backToCourse', { defaultValue: 'Back to course' })}
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* ─── Main Content (Right in RTL) ─── */}
          <div className="flex-1 w-full order-2 lg:order-1">
            
            <div className="bg-blueLight/10 rounded-xl p-4 flex gap-3 mb-8 border border-blueNormal/10">
              <Info className="size-6 text-blueNormal shrink-0" />
              <p className="font-cairo-medium-base text-blueNormal leading-relaxed">
                {t('transferNotice', { defaultValue: 'Please transfer the required amount to one of the payment methods available in your country below, then send a clear picture of the transfer receipt.' })}
              </p>
            </div>

            {paymentMethods.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  {/* Flag placeholder based on country code if possible, or generic icon */}
                  <span className="text-2xl">🌍</span>
                  <h2 className="font-cairo-bold-xl text-[#1a1a2e]">
                    {t('availableMethods', { defaultValue: 'Available Payment Methods in' })} {paymentMethods[0].countryCode}
                  </h2>
                </div>
                <p className="font-cairo-medium-base text-greyNormal mb-6">
                  {t('chooseMethod', { defaultValue: 'Choose any of the following methods to transfer the amount' })}
                </p>

                <div className="flex flex-col">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      logoUrl={method.logoUrl}
                      title={method.title}
                      accountIdentifier={method.accountIdentifier}
                      instructionDescription={method.instructionDescription}
                      isSelected={selectedMethodId === method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-black/5 text-center">
                <p className="font-cairo-medium-base text-greyNormal">
                  {t('empty', { defaultValue: 'No payment methods available for your country yet.' })}
                </p>
              </div>
            )}

            {/* Receipt Upload Form */}
            <ReceiptUploadForm courseId={courseId} />

          </div>

          {/* ─── Sidebar Summary (Left in RTL) ─── */}
          <div className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2 sticky top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              <div className="p-5 border-b border-black/5 bg-gray-50 flex items-center justify-center gap-2">
                <h3 className="font-cairo-bold-lg text-greyDark text-center">{t('summaryTitle', { defaultValue: 'Subscription Summary' })}</h3>
              </div>
              
              <div className="p-5 flex flex-col gap-5">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/5">
                  <Image
                    src={course.cardImageUrl || '/images/courses/course-cover.jpg'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h4 className="font-cairo-bold-lg text-greyDark leading-snug">
                  {course.title}
                </h4>

                {course.resolvedPrice ? (
                  <div className="flex flex-col gap-3 py-4 border-y border-black/5 mt-2">
                    <div className="flex items-center justify-between font-cairo-medium-sm text-greyNormal">
                      <span>{t('originalPrice', { defaultValue: 'Original Price' })}</span>
                      <span className="line-through">{course.resolvedPrice.price} {course.resolvedPrice.currencyCode}</span>
                    </div>
                    {course.resolvedPrice.discountPrice && (
                      <div className="flex items-center justify-between font-cairo-medium-sm text-green-600">
                        <span>{t('discount', { defaultValue: 'Discount' })}</span>
                        <span>-{(course.resolvedPrice.price - course.resolvedPrice.discountPrice).toFixed(2)} {course.resolvedPrice.currencyCode}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="font-cairo-medium-sm text-greyNormal">{t('requiredAmount', { defaultValue: 'Required Amount' })}</span>
                      <div className="flex items-center justify-between">
                        <span className="font-cairo-bold-2xl text-orange-500">
                          {course.resolvedPrice.discountPrice || course.resolvedPrice.price}
                        </span>
                        <span className="font-cairo-bold-lg text-greyDark">{course.resolvedPrice.currencyCode}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 border-y border-black/5 mt-2">
                    <span className="font-cairo-bold-2xl text-green-600">{t('free', { defaultValue: 'Free' })}</span>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between font-cairo-medium-sm">
                    <span className="text-greyNormal">{t('country', { defaultValue: 'Country' })}</span>
                    {paymentMethods[0] ? (
                       <span className="text-greyDark font-cairo-bold-sm flex items-center gap-2">
                         {paymentMethods[0].countryCode} 🌍
                       </span>
                    ) : (
                      <span className="text-greyDark font-cairo-bold-sm">—</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between font-cairo-medium-sm">
                    <span className="text-greyNormal">{t('selectedMethod', { defaultValue: 'Payment Method' })}</span>
                    <span className="text-blueNormal font-cairo-bold-sm">
                      {selectedMethodId 
                        ? paymentMethods.find(m => m.id === selectedMethodId)?.title 
                        : t('notSelected', { defaultValue: 'Not selected yet' })
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 bg-white rounded-2xl p-5 flex gap-4 border border-black/5 items-start">
              <div className="w-12 h-12 bg-blueLight/20 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="size-6 text-blueNormal" />
              </div>
              <div className="flex flex-col">
                <span className="font-cairo-bold-base text-greyDark mb-1">{t('secureData', { defaultValue: '100% Secure Data' })}</span>
                <span className="font-cairo-medium-sm text-greyNormal leading-relaxed">
                  {t('secureDataDesc', { defaultValue: 'We do not share your data with any external party and it is used only to activate your subscription.' })}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
