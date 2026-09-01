'use client';

// ─── PDF Viewer Component ───
// Renders a PDF viewer using the browser's native PDF rendering
// via an <iframe>. Uses the direct PDF URL from the backend
// (lesson.pdf.filePath) instead of proxying, to avoid timeout issues.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

interface PdfViewerProps {
  lessonId: string;
  title: string;
  // Direct URL to the PDF file from the backend data
  pdfUrl: string;
}

export default function PdfViewer({ lessonId, title, pdfUrl }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const t = useTranslations('WatchingCourse');

  console.log('[PdfViewer] Loading PDF from direct URL:', pdfUrl);

  return (
    <div className="w-full bg-[#525659] relative">
      {/* ─── Loading Overlay ─── */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f8f9fb]">
          <div className="relative flex items-center justify-center mb-6">
            {/* Outer pulsating rings */}
            <div className="absolute inset-0 rounded-2xl border border-orange-500/40 animate-ping" />
            <div className="absolute -inset-4 rounded-2xl border border-orange-500/20 animate-pulse" />
            
            {/* Inner static background with icon */}
            <div className="relative bg-white shadow-md p-6 rounded-2xl flex flex-col items-center justify-center">
              <div className="relative">
                <FileText className="size-10 text-orange-500/30" strokeWidth={1.5} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <Loader2 className="size-5 animate-spin text-orange-500" />
                </div>
              </div>
            </div>
          </div>
          <span className="font-cairo-bold-md text-greyDark animate-pulse tracking-wide">
            {t('pdfLoading')}
          </span>
        </div>
      )}

      {/* ─── Error State ─── */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <AlertCircle className="size-12 text-red-400" />
            <span className="font-cairo-bold-lg text-greyDark">
              {t('pdfError')}
            </span>
            <span className="font-cairo-medium-sm text-greyNormal">
              {t('pdfErrorHint')}
            </span>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-cairo-medium-sm transition-colors cursor-pointer"
            >
              {t('retry')}
            </button>
          </div>
        </div>
      )}

      {/* ─── PDF iframe — uses the direct backend URL ─── */}
      <iframe
        key={lessonId} // Force re-mount when lesson changes
        src={pdfUrl}
        title={title}
        className="w-full h-[80vh] border-none"
        onLoad={() => {
          console.log('[PdfViewer] PDF loaded successfully for lesson:', lessonId);
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error('[PdfViewer] PDF load error for lesson:', lessonId, e);
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
