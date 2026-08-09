'use client';

import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

import { Button } from '@/shared/ui/button';
import { Field, FieldLabel, FieldError } from '@/shared/ui/field';
import { useCourseImageForm } from '../hooks/use-course-image-form';

export function AddCourseImage() {
  const t = useTranslations('Dashboard.addCourse.image');
  const tErrors = useTranslations('Dashboard.addCourse.errors');
  const { form, onSubmit, courseId, isPending, existingCardImageUrl, existingDetailImageUrl } = useCourseImageForm();
  
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const [detailPreview, setDetailPreview] = useState<string | null>(null);
  
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const detailFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File) => void, setPreview: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const displayCardImage = cardPreview || existingCardImageUrl;
  const displayDetailImage = detailPreview || existingDetailImageUrl;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <h2 className="font-cairo-bold-xl text-greyDarker mb-2">{t('title')}</h2>
        <p className="font-cairo-medium-sm text-greyNormal">{t('description')}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Image */}
        <Controller
          name="cardImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                {t('cardImageLabel')} <span className="text-red-500 ms-1">*</span>
              </FieldLabel>
              <p className="text-xs text-greyNormal mb-2 font-cairo-medium-sm">{t('cardImageDescription', { defaultValue: 'Used for course cards and thumbnails.' })}</p>
              
              <div 
                onClick={() => cardFileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  fieldState.error ? 'border-red-400 bg-red-50 hover:bg-red-100' : 'border-greyLightActive bg-greyLight/10 hover:bg-orangeLight/50'
                }`}
              >
                {displayCardImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayCardImage} alt="Card Preview" className="w-full h-full object-contain rounded-xl p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <ImagePlus className="w-12 h-12 mb-4 text-orangeNormal" />
                    <p className="mb-2 text-sm text-greyDarker font-cairo-semibold-base">
                      {t('uploadPlaceholder')}
                    </p>
                    <p className="text-xs text-greyNormal font-cairo-medium-sm">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={cardFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange, setCardPreview)}
                />
              </div>
              {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
            </Field>
          )}
        />

        {/* Detail Image */}
        <Controller
          name="detailImage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                {t('detailImageLabel')} <span className="text-red-500 ms-1">*</span>
              </FieldLabel>
              <p className="text-xs text-greyNormal mb-2 font-cairo-medium-sm">{t('detailImageDescription', { defaultValue: 'Used as the background in the course details page.' })}</p>
              
              <div 
                onClick={() => detailFileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  fieldState.error ? 'border-red-400 bg-red-50 hover:bg-red-100' : 'border-greyLightActive bg-greyLight/10 hover:bg-orangeLight/50'
                }`}
              >
                {displayDetailImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayDetailImage} alt="Detail Preview" className="w-full h-full object-cover rounded-xl p-2 opacity-80" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <ImagePlus className="w-12 h-12 mb-4 text-blueNormal" />
                    <p className="mb-2 text-sm text-greyDarker font-cairo-semibold-base">
                      {t('uploadPlaceholder')}
                    </p>
                    <p className="text-xs text-greyNormal font-cairo-medium-sm">
                      SVG, PNG, JPG or GIF (Wide format recommended)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={detailFileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, field.onChange, setDetailPreview)}
                />
              </div>
              {fieldState.error && <FieldError>{tErrors(fieldState.error.message || 'generic')}</FieldError>}
            </Field>
          )}
        />
        </div>

        <div className="pt-6 flex justify-end border-t border-black/5">
          <Button 
            variant="dark" 
            type="submit" 
            size="lg" 
            disabled={!courseId || isPending}
            className="font-cairo-bold-base px-8 h-12 cursor-pointer"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('submit')}
          </Button>
        </div>
        {!courseId && (
          <p className="text-red-500 text-sm mt-2 text-end">
            {tErrors('basicInfoRequiredWarning')}
          </p>
        )}
      </form>
    </div>
  );
}
