'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AdminCertificate, UpdateCertificateRequest } from '../lib/types/admin-certificates-types';
import { updateCertificate } from '../api/admin-certificates-api';
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
  const [formData, setFormData] = useState<UpdateCertificateRequest>({
    code: '',
    country: '',
    courseName: '',
    courseNumber: '',
    date: '',
    studentName: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (certificate) {
      setFormData({
        code: certificate.code || '',
        country: certificate.country || '',
        courseName: certificate.courseName || '',
        courseNumber: certificate.courseNumber || '',
        date: certificate.date || '',
        studentName: certificate.studentName || ''
      });
    }
  }, [certificate]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificate) return;

    setIsLoading(true);
    try {
      await updateCertificate(certificate.id, formData);
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.studentName', { defaultValue: 'Student Name' })}</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal font-cairo-medium-sm"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.code', { defaultValue: 'Code' })}</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal font-cairo-medium-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.country', { defaultValue: 'Country' })}</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal font-cairo-medium-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.courseName', { defaultValue: 'Course' })}</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal font-cairo-medium-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.courseNumber', { defaultValue: 'Course No.' })}</label>
              <input
                type="text"
                name="courseNumber"
                value={formData.courseNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal font-cairo-medium-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-cairo-semibold-sm text-greyDark">{t('table.date', { defaultValue: 'Date' })}</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal font-cairo-medium-sm"
              />
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
