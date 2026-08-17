"use client";

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { postSchema, PostFormData } from '../lib/schemas/posts-schemas';
import { useCreatePostMutation, useUpdatePostMutation } from '../hooks/use-posts-api';
import { Post } from '../lib/types/posts-types';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: Post | null;
}

export default function PostFormModal({ isOpen, onClose, postToEdit }: PostFormModalProps) {
  const t = useTranslations('Posts');
  const isEditing = !!postToEdit;
  
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const [imagePreview, setImagePreview] = useState<string | null>(postToEdit?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      isPublic: true,
      image: undefined
    },
  });

  useEffect(() => {
    if (isEditing && postToEdit) {
      form.reset({
        title: postToEdit.title || '',
        content: postToEdit.content || '',
        isPublic: postToEdit.isPublic,
        image: undefined // Image update is separate API usually, but we handle create here
      });
      setImagePreview(postToEdit.imageUrl || null);
    } else if (!isEditing) {
      form.reset({ title: '', content: '', isPublic: true, image: undefined });
      setImagePreview(null);
    }
  }, [isEditing, postToEdit, form]);

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      // Update logic - standard payload without image
      updateMutation.mutate(
        { id: postToEdit!.id, data: { title: data.title, content: data.content, isPublic: data.isPublic } },
        {
          onSuccess: () => {
            toast.success(t('updateSuccess', { defaultValue: 'Post updated successfully' }));
            onClose();
          },
          onError: (error) => {
            toast.error(error.message || t('updateFailed', { defaultValue: 'Failed to update post' }));
          }
        }
      );
      // Note: If they selected a new image while editing, we'd theoretically need a separate API call here 
      // using updatePostImageMutation, but keeping it simple for now as requested.
    } else {
      createMutation.mutate(
        { 
          Title: data.title, 
          Content: data.content, 
          IsPublic: data.isPublic,
          Image: data.image
        }, 
        {
          onSuccess: () => {
            toast.success(t('createSuccess', { defaultValue: 'Post created successfully' }));
            onClose();
          },
          onError: (error) => {
            toast.error(error.message || t('createFailed', { defaultValue: 'Failed to create post' }));
          }
        }
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    form.setValue('image', undefined, { shouldValidate: true });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-blueNormal'}
  `;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h3 className="font-cairo-bold-xl text-greyDark">
            {isEditing ? t('editPost', { defaultValue: 'Edit Post' }) : t('createPost', { defaultValue: 'Create New Post' })}
          </h3>
          <button onClick={onClose} className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="post-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label className="font-cairo-semibold-base text-greyDarker">
                    {t('title', { defaultValue: 'Title' })} *
                  </label>
                  <input
                    {...field}
                    type="text"
                    placeholder={t('titlePlaceholder', { defaultValue: 'Enter post title...' })}
                    className={`${inputClasses(!!fieldState.error)} h-12`}
                  />
                  {fieldState.error && <span className="text-red-500 text-sm font-cairo-medium-sm">{fieldState.error.message}</span>}
                </div>
              )}
            />

            {/* Content */}
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-2">
                  <label className="font-cairo-semibold-base text-greyDarker">
                    {t('content', { defaultValue: 'Content' })} *
                  </label>
                  <textarea
                    {...field}
                    placeholder={t('contentPlaceholder', { defaultValue: 'What do you want to share?' })}
                    className={`${inputClasses(!!fieldState.error)} min-h-[150px] py-3 resize-y`}
                  />
                  {fieldState.error && <span className="text-red-500 text-sm font-cairo-medium-sm">{fieldState.error.message}</span>}
                </div>
              )}
            />

            {/* Image Upload (Only on create for now, as update is a separate endpoint) */}
            {!isEditing && (
              <div className="flex flex-col gap-2">
                <label className="font-cairo-semibold-base text-greyDarker">
                  {t('image', { defaultValue: 'Post Image (Optional)' })}
                </label>
                
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-black/10 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={clearImage}
                        className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/5 hover:border-blueNormal transition-colors text-greyNormal hover:text-blueNormal"
                  >
                    <ImageIcon className="size-8" />
                    <span className="font-cairo-medium-sm">
                      {t('clickToUpload', { defaultValue: 'Click to upload an image' })}
                    </span>
                    <span className="text-xs text-greyNormal opacity-70">
                      JPEG, PNG, WEBP (Max 5MB)
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
                {form.formState.errors.image && <span className="text-red-500 text-sm font-cairo-medium-sm">{form.formState.errors.image.message as string}</span>}
              </div>
            )}

            {/* Visibility Toggle */}
            <Controller
              name="isPublic"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blueNormal"></div>
                    <span className="ms-3 font-cairo-semibold-base text-greyDarker">
                      {field.value 
                        ? t('publicLabel', { defaultValue: 'Public (Visible to everyone)' }) 
                        : t('privateLabel', { defaultValue: 'Private (Hidden from feed)' })}
                    </span>
                  </label>
                </div>
              )}
            />

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-gray-50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-red-400 transition-colors cursor-pointer bg-red-500 text-white"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="submit"
            form="post-form"
            disabled={isSubmitting}
            className="bg-blueNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isEditing ? t('saveChanges', { defaultValue: 'Save Changes' }) : t('createPost', { defaultValue: 'Create Post' })}
          </button>
        </div>
      </div>
    </div>
  );
}
