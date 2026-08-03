'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/button';

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteCourseModal({ isOpen, onClose, onConfirm, isDeleting }: DeleteCourseModalProps) {
  const t = useTranslations('Dashboard.courseList.actions');
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <h3 className="text-center text-lg font-cairo-bold-base text-greyDark mb-2">
            {t('delete')}
          </h3>
          
          <p className="text-center text-sm font-cairo-medium-sm text-greyNormal mb-6">
            {t('confirmDelete')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 font-cairo-semibold-sm cursor-pointer"
              onClick={onClose}
              disabled={isDeleting}
            >
              الغاء
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-cairo-semibold-sm border-transparent cursor-pointer"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              تأكيد الحذف
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
