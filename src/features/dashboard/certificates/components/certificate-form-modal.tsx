'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminCertificate } from '../lib/types/admin-certificates-types';
import { updateCertificate } from '../api/admin-certificates-api';
import { updateCertificateSchema, UpdateCertificateFormValues } from '../lib/schemas/certificate-schema';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface CertificateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: AdminCertificate | null;
}

export default function CertificateFormModal({ isOpen, onClose, certificate }: CertificateFormModalProps) {
  const t = useTranslations('Dashboard.certificates');
  const queryClient = useQueryClient();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateCertificateFormValues>({
    resolver: zodResolver(updateCertificateSchema),
    defaultValues: {
      code: '',
      country: '',
      courseName: '',
      courseNumber: '',
      date: '',
      studentName: ''
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (certificate && isOpen) {
      reset({
        code: certificate.code || '',
        country: certificate.country || '',
        courseName: certificate.courseName || '',
        courseNumber: certificate.courseNumber || '',
        date: certificate.date || '',
        studentName: certificate.studentName || ''
      });
    }
  }, [certificate, isOpen, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && !isLoading) {
      onClose();
    }
  };

  const onSubmit = async (data: UpdateCertificateFormValues) => {
    if (!certificate) return;

    setIsLoading(true);
    try {
      await updateCertificate(certificate.id, data);
      toast.success(t('updateSuccess', { defaultValue: 'Certificate updated successfully' }));
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('updateError', { defaultValue: 'Failed to update certificate' }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted || !certificate) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 className="font-cairo-bold-xl text-greyDark">{t('editCertificate', { defaultValue: 'Edit Certificate' })}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.studentName', { defaultValue: 'Student Name' })}</label>
              <input
                type="text"
                {...register('studentName')}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 font-cairo-medium-sm text-greyDarker bg-gray-50 focus:bg-white transition-colors ${errors.studentName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal'}`}
              />
              {errors.studentName && <p className="text-xs text-red-500">{errors.studentName.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.code', { defaultValue: 'Code' })}</label>
              <input
                type="text"
                {...register('code')}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 font-cairo-medium-sm font-mono text-greyDarker bg-gray-50 focus:bg-white transition-colors ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal'}`}
              />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.country', { defaultValue: 'Country' })}</label>
              <input
                type="text"
                {...register('country')}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 font-cairo-medium-sm text-greyDarker bg-gray-50 focus:bg-white transition-colors ${errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal'}`}
              />
              {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.courseName', { defaultValue: 'Course' })}</label>
              <input
                type="text"
                {...register('courseName')}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 font-cairo-medium-sm text-greyDarker bg-gray-50 focus:bg-white transition-colors ${errors.courseName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal'}`}
              />
              {errors.courseName && <p className="text-xs text-red-500">{errors.courseName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.courseNumber', { defaultValue: 'Course No.' })}</label>
              <input
                type="text"
                {...register('courseNumber')}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 font-cairo-medium-sm text-greyDarker bg-gray-50 focus:bg-white transition-colors ${errors.courseNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal'}`}
              />
              {errors.courseNumber && <p className="text-xs text-red-500">{errors.courseNumber.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.date', { defaultValue: 'Date' })}</label>
              <input
                type="text"
                {...register('date')}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 font-cairo-medium-sm text-greyDarker bg-gray-50 focus:bg-white transition-colors ${errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-black/10 focus:border-blueNormal focus:ring-blueNormal'}`}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl border border-black/10 font-cairo-semibold-sm text-greyDark hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {t('cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-blueNormal text-white font-cairo-semibold-sm hover:bg-blueHover transition-colors cursor-pointer disabled:opacity-50 flex items-center"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin me-2" />}
              {t('save', { defaultValue: 'Save Changes' })}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
