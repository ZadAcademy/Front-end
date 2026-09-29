'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Award, Loader2, Search, CheckCircle2, AlertCircle, Calendar, BookOpen, Hash, MapPin, User } from 'lucide-react';
import { useVerifyCertificateMutation } from '../hooks/use-verify-certificate-api';
import { CertificateData } from '../lib/types/verify-certificate-types';
import { toast } from 'sonner';

export default function VerifyCertificateForm() {
  const t = useTranslations('VerifyCertificate');
  const verifyMutation = useVerifyCertificateMutation();

  const [code, setCode] = useState('');
  const [result, setResult] = useState<CertificateData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setErrorMsg(null);
    setResult(null);

    verifyMutation.mutate(code.trim(), {
      onSuccess: (data) => {
        setResult(data);
        toast.success(t('successMessage', { defaultValue: 'Certificate Verified Successfully' }));
      },
      onError: (error: any) => {
        setErrorMsg(t('errorMessage', { defaultValue: 'Certificate not found or invalid code.' }));
        toast.error(t('errorMessage', { defaultValue: 'Certificate not found or invalid code.' }));
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-black/10 overflow-hidden max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="bg-blueNormal/5 p-8 border-b border-black/5 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-blueNormal text-white rounded-full flex items-center justify-center shadow-lg shadow-blueNormal/30">
          <Award className="size-8" />
        </div>
        <div>
          <h2 className="font-cairo-bold-2xl text-greyDark">{t('title', { defaultValue: 'Verify Your Certificate' })}</h2>
          <p className="font-cairo-medium-base text-greyNormal mt-2 max-w-lg mx-auto">
            {t('subtitle', { defaultValue: 'Enter your unique certificate code to verify its authenticity.' })}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative z-10 ">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 pl-4 rtl:pr-4 flex items-center pointer-events-none">
              <Search className="size-5 text-greyNormal" />
            </div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('codePlaceholder', { defaultValue: 'Enter certificate code...' })}
              className="w-full h-14 pl-12 pr-4 rtl:pl-4 rtl:pr-12 rounded-xl border border-black/10 bg-gray-50 
                         font-cairo-medium-lg text-greyDarker outline-none focus:border-blueNormal focus:bg-white 
                         focus:ring-4 focus:ring-blueNormal/10 transition-all uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || verifyMutation.isPending}
            className="h-14 px-8 rounded-xl bg-blueNormal text-white font-cairo-bold-lg 
                       hover:bg-blueDark transition-colors shadow-lg shadow-blueNormal/20
                       flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {verifyMutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Award className="size-5" />
            )}
            {t('verifyButton', { defaultValue: 'Verify' })}
          </button>
        </form>

        {/* Results Section */}
        <div className="mt-8 transition-all duration-500 ease-in-out">
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95">
              <AlertCircle className="size-12 text-red-500 mb-3" />
              <h3 className="font-cairo-bold-xl text-red-700">{t('notFound', { defaultValue: 'Certificate Not Found' })}</h3>
              <p className="font-cairo-medium-base text-red-600 mt-1">{errorMsg}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-1 animate-in fade-in zoom-in-95">
              <div className="bg-white rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-black/5">
                  <CheckCircle2 className="size-8 text-green-600 shrink-0" />
                  <div>
                    <h3 className="font-cairo-bold-xl text-green-700">{t('successMessage', { defaultValue: 'Certificate Verified Successfully' })}</h3>
                    <p className="font-cairo-medium-sm text-greyNormal">{t('certificateCode', { defaultValue: 'Certificate Code' })}: <span className="font-cairo-bold-sm text-greyDark uppercase">{result.code}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-cairo-medium-sm text-greyNormal flex items-center gap-1.5">
                      <User className="size-4" /> {t('studentName', { defaultValue: 'Student Name' })}
                    </span>
                    <span className="font-cairo-bold-lg text-greyDark">{result.studentName}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="font-cairo-medium-sm text-greyNormal flex items-center gap-1.5">
                      <BookOpen className="size-4" /> {t('courseName', { defaultValue: 'Course Name' })}
                    </span>
                    <span className="font-cairo-bold-lg text-blueNormal">{result.courseName}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-cairo-medium-sm text-greyNormal flex items-center gap-1.5">
                      <Hash className="size-4" /> {t('courseNumber', { defaultValue: 'Course Number' })}
                    </span>
                    <span className="font-cairo-bold-base text-greyDark">{result.courseNumber}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-cairo-medium-sm text-greyNormal flex items-center gap-1.5">
                      <Calendar className="size-4" /> {t('date', { defaultValue: 'Date' })}
                    </span>
                    <span className="font-cairo-bold-base text-greyDark">{result.date}</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-cairo-medium-sm text-greyNormal flex items-center gap-1.5">
                      <MapPin className="size-4" /> {t('country', { defaultValue: 'Country' })}
                    </span>
                    <span className="font-cairo-bold-base text-greyDark">{result.country}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
