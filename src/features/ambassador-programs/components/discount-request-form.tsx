'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { AmbassadorProgram } from '../lib/types';
import { getAmbassadorTypeConfig } from '@/features/dashboard/ambassadors/lib/constants/ambassador-types-config';
import { useSubmitDiscountRequestMutation } from '../hooks/use-discount-request';
import { fetchCourses } from '@/features/home/lib/api/courses-api';

interface DiscountRequestFormProps {
  program: AmbassadorProgram;
  courseId?: string;
  courseTitle?: string;
  onBack: () => void;
  onCloseModal: () => void;
}

export default function DiscountRequestForm({
  program,
  courseId: initialCourseId,
  courseTitle: initialCourseTitle,
  onBack,
  onCloseModal,
}: DiscountRequestFormProps) {
  const t = useTranslations('AmbassadorPrograms');
  const tTypes = useTranslations('Dashboard.ambassadors.types');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const config = getAmbassadorTypeConfig(program.type);
  const Icon = config.icon;

  const submitMutation = useSubmitDiscountRequestMutation();

  // Course Selection State
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || '');
  const [coursesList, setCoursesList] = useState<{ id: string; title: string }[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(!initialCourseId);

  // Form Fields State
  const minCount = program.minItems || 1;
  const maxCount = program.maxItems || 99;

  // Dynamic Array for proofData (Type 1, 2, 4)
  const [proofList, setProofList] = useState<string[]>(() => {
    if (program.type === 3) return [];
    return Array.from({ length: Math.max(minCount, 1) }, () => '');
  });

  // Returning Student Fields (Type 3)
  const [prevCourseName, setPrevCourseName] = useState<string>('');
  const [prevCourseNumber, setPrevCourseNumber] = useState<string>('');

  // Common Fields
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch courses list if courseId is not passed in props
  useEffect(() => {
    if (initialCourseId) return;
    let isMounted = true;
    setLoadingCourses(true);
    fetchCourses({ page: 1, pageSize: 50, Status: 'Published' })
      .then((res) => {
        if (!isMounted) return;
        if (res && 'items' in res) {
          setCoursesList(res.items.map((c: any) => ({ id: c.id, title: c.title })));
        }
      })
      .finally(() => {
        if (isMounted) setLoadingCourses(false);
      });
    return () => {
      isMounted = false;
    };
  }, [initialCourseId]);

  // Handle dynamic proof list changes
  const handleProofChange = (index: number, val: string) => {
    setProofList((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddProofItem = () => {
    if (proofList.length >= maxCount) return;
    setProofList((prev) => [...prev, '']);
  };

  const handleRemoveProofItem = (index: number) => {
    if (proofList.length <= Math.max(minCount, 1)) return;
    setProofList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedCourseId) {
      setErrorMsg(t('validation.courseRequired'));
      return;
    }

    if (program.type === 3) {
      if (!prevCourseName.trim()) {
        setErrorMsg(t('validation.courseNameRequired'));
        return;
      }
      if (!prevCourseNumber.trim()) {
        setErrorMsg(t('validation.courseNumberRequired'));
        return;
      }
    } else {
      const filledItems = proofList.map((item) => item.trim()).filter(Boolean);
      if (program.minItems != null && filledItems.length < program.minItems) {
        setErrorMsg(t('validation.minItems', { min: program.minItems }));
        return;
      }
      if (program.maxItems != null && filledItems.length > program.maxItems) {
        setErrorMsg(t('validation.maxItems', { max: program.maxItems }));
        return;
      }
      if (program.type === 1) {
        // Check valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const item of filledItems) {
          if (!emailRegex.test(item)) {
            setErrorMsg(t('validation.invalidEmail'));
            return;
          }
        }
      }
    }

    try {
      const payload = {
        courseId: selectedCourseId,
        discountType: program.type,
        proofData: program.type === 3 ? [] : proofList.map((i) => i.trim()).filter(Boolean),
        courseName: program.type === 3 ? prevCourseName.trim() : null,
        courseNumber: program.type === 3 ? prevCourseNumber.trim() : null,
        notes: notes.trim() || null,
      };

      const requestId = await submitMutation.mutateAsync(payload);
      toast.success(isRTL ? 'تم تقديم طلب الخصم بنجاح! جاري التوجيه للدفع...' : 'Discount request submitted! Redirecting to payment...');
      onCloseModal();
      router.push(`/${locale}/courses/${selectedCourseId}/checkout?discountRequestId=${requestId}&discountPercent=${program.percent}`);
    } catch (err: any) {
      setErrorMsg(err?.message || t('error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden bg-white">
      {/* ─── Header bar ─── */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-black/10 gap-2 shrink-0 bg-white">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-greyNormal hover:text-blueNormal font-cairo-medium-sm transition-colors shrink-0"
        >
          {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          <span>{t('back')}</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 font-cairo-bold-xs sm:font-cairo-bold-sm truncate">
          <Icon className="size-3.5 sm:size-4 shrink-0" />
          <span className="truncate">{tTypes(`${config.key}.name`)}</span>
          <span className="font-bold shrink-0">({Number(program.percent)}% {t('off')})</span>
        </div>
      </div>

      {/* ─── Scrollable Form Fields ─── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 sm:gap-5">
        {/* Unauthenticated Warning */}
        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 shrink-0" />
              <span className="font-cairo-medium-sm">{t('loginRequired')}</span>
            </div>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-cairo-bold-sm shadow-sm transition-colors shrink-0"
            >
              <LogIn className="size-4" />
              <span>{t('loginBtn')}</span>
            </Link>
          </div>
        )}

        {/* Error Message Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-3.5 flex items-center gap-2 text-red-600 font-cairo-medium-sm">
            <AlertCircle className="size-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Course Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-cairo-bold-sm text-greyDark">{t('selectCourse')}</label>
          {initialCourseTitle ? (
            <div className="px-3.5 py-2.5 sm:py-3 rounded-xl bg-black/5 border border-black/10 font-cairo-medium-sm sm:font-cairo-medium-base text-greyDark truncate">
              {initialCourseTitle}
            </div>
          ) : loadingCourses ? (
            <div className="flex items-center gap-2 px-3.5 py-2.5 sm:py-3 rounded-xl border border-black/10 bg-white text-greyNormal font-cairo-medium-sm">
              <Loader2 className="size-4 animate-spin text-blueNormal shrink-0" />
              <span>{t('selectCoursePlaceholder')}</span>
            </div>
          ) : (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors"
            >
              <option value="">{t('selectCoursePlaceholder')}</option>
              {coursesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* PROGRAM TYPE 1: GroupEnrollment */}
        {program.type === 1 && (
          <div className="flex flex-col gap-2.5">
            <div>
              <h4 className="font-cairo-bold-sm sm:font-cairo-bold-base text-greyDark">{t('groupEmailsTitle')}</h4>
              <p className="font-cairo-regular-xs sm:font-cairo-regular-sm text-greyNormal">
                {t('groupEmailsDesc', { min: program.minItems || 1, max: program.maxItems || '∞' })}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {proofList.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder={`member${idx + 1}@example.com`}
                    value={email}
                    onChange={(e) => handleProofChange(idx, e.target.value)}
                    className="flex-1 h-10 sm:h-11 px-3.5 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors"
                  />
                  {proofList.length > Math.max(minCount, 1) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProofItem(idx)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  )}
                </div>
              ))}

              {proofList.length < maxCount && (
                <button
                  type="button"
                  onClick={handleAddProofItem}
                  className="w-fit inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueNormal/10 text-blueNormal hover:bg-blueNormal/20 font-cairo-bold-xs sm:font-cairo-bold-sm transition-colors"
                >
                  <Plus className="size-4" />
                  <span>{t('addEmail')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PROGRAM TYPE 2: EngineerLeads */}
        {program.type === 2 && (
          <div className="flex flex-col gap-2.5">
            <div>
              <h4 className="font-cairo-bold-sm sm:font-cairo-bold-base text-greyDark">{t('engineerLeadsTitle')}</h4>
              <p className="font-cairo-regular-xs sm:font-cairo-regular-sm text-greyNormal">
                {t('engineerLeadsDesc', { min: program.minItems || 1, max: program.maxItems || '∞' })}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {proofList.map((lead, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Person ${idx + 1}`}
                    value={lead}
                    onChange={(e) => handleProofChange(idx, e.target.value)}
                    className="flex-1 h-10 sm:h-11 px-3.5 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors"
                  />
                  {proofList.length > Math.max(minCount, 1) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProofItem(idx)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  )}
                </div>
              ))}

              {proofList.length < maxCount && (
                <button
                  type="button"
                  onClick={handleAddProofItem}
                  className="w-fit inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueNormal/10 text-blueNormal hover:bg-blueNormal/20 font-cairo-bold-xs sm:font-cairo-bold-sm transition-colors"
                >
                  <Plus className="size-4" />
                  <span>{t('addPerson')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PROGRAM TYPE 4: GroupLinks */}
        {program.type === 4 && (
          <div className="flex flex-col gap-2.5">
            <div>
              <h4 className="font-cairo-bold-sm sm:font-cairo-bold-base text-greyDark">{t('groupLinksTitle')}</h4>
              <p className="font-cairo-regular-xs sm:font-cairo-regular-sm text-greyNormal">
                {t('groupLinksDesc', { min: program.minItems || 1, max: program.maxItems || '∞' })}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {proofList.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://chat.whatsapp.com/..."
                    value={link}
                    onChange={(e) => handleProofChange(idx, e.target.value)}
                    className="flex-1 h-10 sm:h-11 px-3.5 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors"
                  />
                  {proofList.length > Math.max(minCount, 1) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProofItem(idx)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  )}
                </div>
              ))}

              {proofList.length < maxCount && (
                <button
                  type="button"
                  onClick={handleAddProofItem}
                  className="w-fit inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueNormal/10 text-blueNormal hover:bg-blueNormal/20 font-cairo-bold-xs sm:font-cairo-bold-sm transition-colors"
                >
                  <Plus className="size-4" />
                  <span>{t('addLink')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PROGRAM TYPE 3: ReturningStudent */}
        {program.type === 3 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-cairo-bold-sm text-greyDark">{t('prevCourseName')}</label>
              <input
                type="text"
                placeholder={t('prevCourseNamePlaceholder')}
                value={prevCourseName}
                onChange={(e) => setPrevCourseName(e.target.value)}
                className="w-full h-10 sm:h-11 px-3.5 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-cairo-bold-sm text-greyDark">{t('prevCourseNumber')}</label>
              <input
                type="text"
                placeholder={t('prevCourseNumberPlaceholder')}
                value={prevCourseNumber}
                onChange={(e) => setPrevCourseNumber(e.target.value)}
                className="w-full h-10 sm:h-11 px-3.5 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors"
              />
            </div>
          </div>
        )}

        {/* Common: Notes */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="font-cairo-bold-sm text-greyDark">{t('notesLabel')}</label>
          <textarea
            rows={2}
            placeholder={t('notesPlaceholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-black/15 bg-white font-cairo-regular-sm sm:font-cairo-regular-base text-greyDark outline-none focus:border-blueNormal transition-colors resize-none"
          />
        </div>
      </div>

      {/* ─── Action Buttons Footer ─── */}
      <div className="p-4 sm:p-5 border-t border-black/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 w-full shrink-0 bg-white">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-black/10 font-cairo-medium-sm sm:font-cairo-medium-base text-greyDark hover:bg-black/5 transition-colors"
        >
          {t('back')}
        </button>
        <button
          type="submit"
          disabled={submitMutation.isPending || !isAuthenticated}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-orangeNormal text-white font-cairo-bold-sm sm:font-cairo-bold-base hover:bg-[#E57B24] transition-colors shadow-md shadow-orangeNormal/20 disabled:opacity-50 cursor-pointer"
        >
          {submitMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          <span>{submitMutation.isPending ? t('submitting') : t('submit')}</span>
        </button>
      </div>
    </form>
  );
}
