'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import VerifyCertificateForm from './verify-certificate-form';

/**
 * VerifyCertificateModal — Dialog wrapper around VerifyCertificateForm.
 * Opens automatically if the URL contains `?verify=true`.
 */
export default function VerifyCertificateModal() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const isOpen = searchParams?.get('verify') === 'true';

  const onClose = () => {
    // Remove the verify query parameter while keeping others (if any)
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    newParams.delete('verify');
    const newSearch = newParams.toString();
    router.push(`${pathname}${newSearch ? `?${newSearch}` : ''}`, { scroll: false });
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]); // Using onClose inside a useEffect that depends on isOpen is fine here

  // Only render on the client
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        // Close on backdrop click (not on content click)
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-greyDarker/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        style={{
          animation: 'modalEnter 0.25s ease-out',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-greyNormal hover:text-white hover:bg-red-500 transition-colors cursor-pointer border-none"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <VerifyCertificateForm />
      </div>

      {/* Inline keyframes for enter animation */}
      <style>{`
        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
