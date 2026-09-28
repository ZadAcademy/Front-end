'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FileUp, Loader2, File as FileIcon, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useImportCertificatesMutation } from '../hooks/use-import-certificates-api';
import { ImportCertificateData } from '../lib/types/certificate-types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const formSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, 'File is required')
    .refine((file) => file?.size <= 10 * 1024 * 1024, 'Max file size is 10MB.')
    .refine(
      (file) =>
        file && (file.type === 'text/csv' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel' || 
                 file.name.endsWith('.csv') || 
                 file.name.endsWith('.xlsx')),
      'Only .csv and .xlsx formats are supported.'
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ImportCertificatesForm() {
  const t = useTranslations('Dashboard.certificates');
  const importMutation = useImportCertificatesMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<ImportCertificateData | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const selectedFile = watch('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue('file', e.target.files[0], { shouldValidate: true });
      setResult(null); // Reset previous result on new file selection
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue('file', e.dataTransfer.files[0], { shouldValidate: true });
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setValue('file', undefined as any, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('file', data.file);

    importMutation.mutate(formData, {
      onSuccess: (responseData) => {
        setResult(responseData);
        toast.success(t('importSuccess', { inserted: responseData.inserted, skipped: responseData.skipped, defaultValue: `Successfully imported ${responseData.inserted} certificates. Skipped: ${responseData.skipped}` }));
        // Clear file input on success
        setValue('file', undefined as any);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (error: any) => {
        toast.error(error.message || t('importError', { defaultValue: 'Failed to import certificates' }));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" rounded-2xl shadow-sm border bg-white border-black/5 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
          <FileUp className="size-5 text-blue-600" />
        </div>
        <h3 className="font-cairo-bold-xl text-greyDark">
          {t('importTitle', { defaultValue: 'Import Certificates' })}
        </h3>
      </div>

      {/* File Upload Area */}
      <div className="flex flex-col gap-2">
        <label className="font-cairo-bold-sm text-greyDark">
          {t('uploadFile', { defaultValue: 'Upload File' })}
        </label>
        
        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-black/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3
                       hover:border-blueNormal hover:bg-blueLight/5 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <FileUp className="size-6 text-greyNormal group-hover:text-blueNormal transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-cairo-bold-base text-greyDark">
                {t('dragAndDrop', { defaultValue: 'Click or drag file to this area to upload' })}
              </p>
              <p className="font-cairo-medium-sm text-greyNormal mt-1">
                {t('supportedFormats', { defaultValue: 'Supported formats: .xlsx, .csv' })}
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-black/10 rounded-xl p-4 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-black/5 flex items-center justify-center shrink-0">
                <FileIcon className="size-5 text-blueNormal" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-cairo-bold-sm text-greyDark truncate">
                  {selectedFile.name}
                </span>
                <span className="font-cairo-medium-xs text-greyNormal">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-greyNormal hover:text-red-500 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        
        {/* Zod Validation Error */}
        {errors.file && (
          <p className="text-red-500 font-cairo-medium-sm mt-1 flex items-center gap-1.5">
            <AlertCircle className="size-4" />
            {errors.file.message}
          </p>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-gray-50 rounded-xl p-5 border border-black/5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-600" />
            <h4 className="font-cairo-bold-base text-greyDark">
              {t('importSummary', { defaultValue: 'Import Summary' })}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-black/5 flex flex-col items-start gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5">
                <FileIcon className="size-24" />
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 relative z-10">
                <FileIcon className="size-5 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="font-cairo-bold-2xl text-greyDark">{result.totalRows}</div>
                <div className="font-cairo-medium-sm text-greyNormal mt-0.5">{t('totalRows', { defaultValue: 'Total Rows' })}</div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-black/5 flex flex-col items-start gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5 text-green-600">
                <CheckCircle2 className="size-24" />
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 relative z-10">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div className="relative z-10">
                <div className="font-cairo-bold-2xl text-greyDark">{result.inserted}</div>
                <div className="font-cairo-medium-sm text-greyNormal mt-0.5">{t('inserted', { defaultValue: 'Inserted' })}</div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-black/5 flex flex-col items-start gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5 text-orange-500">
                <AlertCircle className="size-24" />
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 relative z-10">
                <AlertCircle className="size-5 text-orange-500" />
              </div>
              <div className="relative z-10">
                <div className="font-cairo-bold-2xl text-greyDark">{result.skipped}</div>
                <div className="font-cairo-medium-sm text-greyNormal mt-0.5">{t('skipped', { defaultValue: 'Skipped' })}</div>
              </div>
            </div>
          </div>
          
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              <h5 className="font-cairo-bold-sm text-red-500 flex items-center gap-1.5">
                <AlertCircle className="size-4" />
                {t('errors', { defaultValue: 'Errors' })} ({result.errors.length})
              </h5>
              <div className="bg-white border border-red-100 rounded-lg max-h-40 overflow-y-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-red-50 font-cairo-bold-sm text-red-700 sticky top-0">
                    <tr>
                      <th className="py-2 px-3">{t('row', { defaultValue: 'Row' })}</th>
                      <th className="py-2 px-3">{t('column', { defaultValue: 'Column' })}</th>
                      <th className="py-2 px-3">{t('message', { defaultValue: 'Message' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((err, idx) => (
                      <tr key={idx} className="border-t border-red-50 font-cairo-medium-sm text-greyDark">
                        <td className="py-2 px-3">{err.rowNumber}</td>
                        <td className="py-2 px-3">{err.column}</td>
                        <td className="py-2 px-3 text-red-600">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={importMutation.isPending || !selectedFile}
        className="self-start flex items-center gap-2 px-8 py-3 rounded-xl bg-blueNormal text-white
                   font-cairo-bold-base hover:bg-blueDark transition-colors shadow-lg shadow-blueNormal/20
                   cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {importMutation.isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <FileUp className="size-5" />
        )}
        {t('uploadButton', { defaultValue: 'Upload File' })}
      </button>
    </form>
  );
}
