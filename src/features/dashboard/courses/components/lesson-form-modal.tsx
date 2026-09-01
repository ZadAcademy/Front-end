'use client';

// ─── Lesson Form Modal ───
// - Uses react-hook-form and zod for robust validation
// - Distinct visual treatment for Video vs PDF modes
// - Form resets and closes on successful creation

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Loader2,
  PlayCircle,
  FileText,
  UploadCloud,
  Link2,
  Clock,
  CheckCircle2,
  Trash2,
  FileUp,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

import { LessonType } from '../lib/types/lesson';
import {
  useCreateVideoLessonMutation,
  useCreatePdfLessonMutation,
} from '../hooks/use-lesson-api';
import { lessonSchema, LessonFormData } from '../lib/schemas/lesson-schemas';

interface LessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  courseId: string;
}

export function LessonFormModal({
  isOpen,
  onClose,
  sectionId,
  courseId,
}: LessonFormModalProps) {
  const t = useTranslations('Dashboard.addCourse.lessons');
  const tErrors = useTranslations('Dashboard.addCourse.errors');

  // ─── Form Setup ───
  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      lessonType: LessonType.GoogleDriveVideo,
      title: '',
      videoUrl: '',
    } as any,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  const lessonType = watch('lessonType');
  const pdfFile = watch('pdfFile' as any); // using any for union fields safely

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setIsDragOver(false);
    }
  }, [isOpen, reset]);

  // ─── Drag and drop state ───
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Mutations ───
  const createVideoMutation = useCreateVideoLessonMutation(courseId);
  const createPdfMutation = useCreatePdfLessonMutation(courseId);
  const isSubmitting = createVideoMutation.isPending || createPdfMutation.isPending;

  // ─── Format file size ───
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─── File Validation (manually handling setter for react-hook-form) ───
  const validateAndSetPdf = (file: File) => {
    setValue('pdfFile' as any, file, { shouldValidate: true });
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetPdf(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetPdf(file);
  };

  const clearPdf = () => {
    setValue('pdfFile' as any, undefined, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  // ─── Submit ───
  const onSubmit = (data: LessonFormData) => {
    if (data.lessonType === LessonType.GoogleDriveVideo) {
      createVideoMutation.mutate(
        {
          sectionId,
          title: data.title.trim(),
          videoUrl: data.videoUrl.trim(),
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else if (data.lessonType === LessonType.Pdf) {
      const formData = new FormData();
      formData.append('SectionId', sectionId);
      formData.append('Title', data.title.trim());
      formData.append('PdfFile', data.pdfFile);

      createPdfMutation.mutate(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  const inputClasses =
    'w-full px-4 h-11 rounded-lg border bg-white font-cairo-regular-base text-greyDarker placeholder:text-greyLightActive outline-none focus:border-orangeNormal transition-colors duration-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h3 className="font-cairo-bold-xl text-greyDark">{t('addLesson')}</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ─── Form Content ─── */}
        <div className="flex-1 overflow-y-auto p-6">
          <form
            id="lesson-form"
            onSubmit={handleSubmit(onSubmit, (err) => {
              // Toast the first error found
              const firstError = Object.values(err)[0];
              if (firstError?.message) {
                toast.error(tErrors(firstError.message as any));
              }
            })}
            className="flex flex-col gap-6"
          >
            {/* ── Step 1: Lesson Type Toggle ── */}
            <div className="flex flex-col gap-3">
              <label className="font-cairo-semibold-base text-greyDarker">
                {t('lessonType')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('lessonType', LessonType.GoogleDriveVideo, { shouldValidate: true })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    lessonType === LessonType.GoogleDriveVideo
                      ? 'border-orangeNormal bg-orangeNormal/5 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      lessonType === LessonType.GoogleDriveVideo
                        ? 'bg-orangeNormal/15 text-orangeNormal'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <span
                    className={`font-cairo-bold-sm ${
                      lessonType === LessonType.GoogleDriveVideo
                        ? 'text-orangeNormal'
                        : 'text-gray-500'
                    }`}
                  >
                    {t('videoLesson')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('lessonType', LessonType.Pdf, { shouldValidate: true })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    lessonType === LessonType.Pdf
                      ? 'border-orangeNormal bg-orangeNormal/5 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      lessonType === LessonType.Pdf
                        ? 'bg-orangeNormal/15 text-orangeNormal'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <span
                    className={`font-cairo-bold-sm ${
                      lessonType === LessonType.Pdf
                        ? 'text-orangeNormal'
                        : 'text-gray-500'
                    }`}
                  >
                    {t('pdfLesson')}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Step 2: Lesson Title ── */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <label className="font-cairo-semibold-base text-greyDarker">
                    {t('lessonTitle')} *
                  </label>
                  <input
                    type="text"
                    {...field}
                    placeholder={t('lessonTitlePlaceholder')}
                    className={`${inputClasses} ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.title && (
                    <span className="text-xs text-red-500 font-cairo-medium-sm">
                      {tErrors(errors.title.message as any)}
                    </span>
                  )}
                </div>
              )}
            />

            {/* ── Step 3: Type-specific Fields ── */}
            {lessonType === LessonType.GoogleDriveVideo && (
              <>
                {/* Google Drive Video URL */}
                <Controller
                  name="videoUrl"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <label className="font-cairo-semibold-base text-greyDarker">
                        {t('videoUrl')} *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                          <Link2 className="w-4 h-4" />
                        </div>
                        <input
                          type="url"
                          {...field}
                          placeholder={t('videoUrlPlaceholder')}
                          className={`${inputClasses} ps-10 ${(errors as any).videoUrl ? 'border-red-500 focus:border-red-500' : 'border-gray-200'}`}
                        />
                      </div>
                      {(errors as any).videoUrl ? (
                        <span className="text-xs text-red-500 font-cairo-medium-sm">
                          {tErrors((errors as any).videoUrl.message)}
                        </span>
                      ) : (
                        <p className="text-xs text-gray-500 font-cairo-regular-sm flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" />
                          {t('videoUrlHint')}
                        </p>
                      )}
                    </div>
                  )}
                />


              </>
            )}

            {lessonType === LessonType.Pdf && (
              <div className="flex flex-col gap-2">
                <label className="font-cairo-semibold-base text-greyDarker">
                  {t('pdfFile')} *
                </label>
                <p className="text-xs text-gray-500 font-cairo-regular-sm -mt-1">
                  {t('pdfMaxSize')}
                </p>

                {pdfFile ? (
                  <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="bg-green-100 p-2.5 rounded-lg shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cairo-semibold-sm text-greyDarker truncate">
                        {(pdfFile as File).name}
                      </p>
                      <p className="text-xs text-gray-500 font-cairo-regular-sm">
                        {t('pdfFileSize')}: {formatFileSize((pdfFile as File).size)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-cairo-bold-sm text-orangeNormal bg-white border border-orangeNormal/30 rounded-lg hover:bg-orangeNormal/5 transition-colors"
                      >
                        {t('pdfChangeFile')}
                      </button>
                      <button
                        type="button"
                        onClick={clearPdf}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                      (errors as any).pdfFile
                        ? 'border-red-500 bg-red-50'
                        : isDragOver
                        ? 'border-orangeNormal bg-orangeNormal/5 scale-[1.01]'
                        : 'border-gray-300 hover:border-orangeNormal hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        (errors as any).pdfFile
                          ? 'bg-red-100 text-red-500'
                          : isDragOver
                          ? 'bg-orangeNormal/15 text-orangeNormal'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-cairo-semibold-sm ${
                          (errors as any).pdfFile
                            ? 'text-red-500'
                            : isDragOver
                            ? 'text-orangeNormal'
                            : 'text-greyDarker'
                        }`}
                      >
                        {t('clickToUploadPdf')}
                      </p>
                      <p className="text-xs text-greyNormal mt-1 font-cairo-regular-sm">
                        {t('pdfFormatHint')}
                      </p>
                    </div>
                  </div>
                )}
                {(errors as any).pdfFile && (
                  <span className="text-xs text-red-500 font-cairo-medium-sm mt-1">
                    {tErrors((errors as any).pdfFile.message)}
                  </span>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePdfChange}
                  accept="application/pdf"
                  className="hidden"
                />
              </div>
            )}
          </form>
        </div>

        {/* ─── Footer ─── */}
        <div className="p-6 border-t border-black/5 bg-gray-50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-gray-600 border border-gray-200 bg-white"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            form="lesson-form"
            disabled={isSubmitting}
            className="bg-orangeNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-base hover:bg-orangeHover transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {lessonType === LessonType.GoogleDriveVideo
              ? t('createVideoLesson')
              : t('createPdfLesson')}
          </button>
        </div>
      </div>
    </div>
  );
}
