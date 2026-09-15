'use client';

import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { Upload, FileImage, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { orderSchema, OrderFormData } from '../lib/schemas/order-schema';
import { useSubmitOrderMutation } from '../hooks/use-checkout-api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ReceiptUploadFormProps {
  courseId: string;
}

export default function ReceiptUploadForm({ courseId }: ReceiptUploadFormProps) {
  const t = useTranslations('Checkout.receiptUpload');
  const locale = useLocale();
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const submitMutation = useSubmitOrderMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      courseId,
    },
  });

  const selectedFile = watch('receiptImage');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('receiptImage', file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = (data: OrderFormData) => {
    const formData = new FormData();
    formData.append('CourseId', data.courseId);
    formData.append('ReceiptImage', data.receiptImage);

    submitMutation.mutate(formData, {
      onSuccess: () => {
        router.replace(`/${locale}/courses/${courseId}/checkout/success`);
      },
      onError: (error: any) => {
        if (error.status === 409) {
          toast.error(t('alreadySubmitted', { defaultValue: 'You have already submitted an order for this course or you are already enrolled.' }));
        } else {
          toast.error(error.message || t('uploadFailed', { defaultValue: 'Failed to upload receipt' }));
        }
      },
    });
  };

  return (
    <div className="mt-8">
      <h3 className="font-cairo-bold-xl text-greyDark text-center mb-6">
        {t('title', { defaultValue: 'Send Transfer Receipt' })}
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-black/10 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Upload Area */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 text-orange-500 shadow-sm border border-orange-100">
            <Upload className="size-8" />
          </div>
          
          <p className="font-cairo-semibold-base text-greyDark mb-1">
            {t('uploadInstruction', { defaultValue: 'Upload a clear image of the transfer receipt' })}
          </p>
          <p className="font-cairo-medium-sm text-greyLightActive mb-6">
            {t('supportedFormats', { defaultValue: '(Supported formats: JPG, PNG - Max size 2MB)' })}
          </p>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blueNormal text-white font-cairo-bold-base px-8 py-3 rounded-xl hover:bg-blueNormalHover transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blueNormal/20"
          >
            <Upload className="size-5" />
            {t('chooseFile', { defaultValue: 'Choose Receipt Image' })}
          </button>
        </div>

        {/* Selected File Preview / Status */}
        {previewUrl && selectedFile && (
          <div className="mt-6 flex items-center gap-4 bg-blueLight/10 p-4 rounded-xl border border-blueNormal/20">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/5 shrink-0 bg-white">
              <img src={previewUrl} alt="Receipt preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-cairo-semibold-sm text-greyDark truncate">{selectedFile.name}</span>
              <span className="font-cairo-medium-xs text-greyNormal">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setValue('receiptImage', undefined as any);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-red-500 text-sm font-cairo-medium-sm hover:underline px-2 cursor-pointer"
            >
              {t('remove', { defaultValue: 'Remove' })}
            </button>
          </div>
        )}

        {/* Error Message */}
        {errors.receiptImage && (
          <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle className="size-4 shrink-0" />
            <span className="font-cairo-medium-sm">{errors.receiptImage.message as string}</span>
          </div>
        )}

        <div className="border-t border-black/5 mt-8 pt-6 flex flex-col items-center">
          <button
            type="submit"
            disabled={!selectedFile || submitMutation.isPending}
            className={`w-full max-w-xs py-3.5 rounded-xl font-cairo-bold-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
              !selectedFile || submitMutation.isPending
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 cursor-pointer'
            }`}
          >
            {submitMutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              t('sendReceipt', { defaultValue: 'Send Receipt' })
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 flex items-start gap-3 bg-blueLight/10 rounded-xl p-4 border border-blueNormal/10">
        <Loader2 className="size-5 text-blueNormal shrink-0 mt-0.5" />
        <p className="font-cairo-medium-sm text-blueNormal leading-relaxed">
          {t('reviewNotice', { defaultValue: 'The transfer receipt will be reviewed by the Zad Academy team within 24 hours as a maximum. You will receive a WhatsApp message and an email confirming the payment and activating the course.' })}
        </p>
      </div>
    </div>
  );
}
