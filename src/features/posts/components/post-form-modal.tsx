"use client";

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { postSchema, PostFormData } from '../lib/schemas/posts-schemas';
import { useCreatePostMutation, useUpdatePostMutation, useUpdatePostImageMutation } from '../hooks/use-posts-api';
import { Post } from '../lib/types/posts-types';
import { Users, BookOpen, UserPlus, Bell } from 'lucide-react';
import { useSendNotificationMutation } from '@/features/notifications/hooks/use-admin-notifications-api';
import { CourseSelector } from '@/shared/components/selectors/course-selector';
import { UserMultiSelector } from '@/shared/components/selectors/user-multi-selector';
import { NotificationType } from '@/features/notifications/lib/types/notification-types';

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
  const updateImageMutation = useUpdatePostImageMutation();
  const sendNotificationMutation = useSendNotificationMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || updateImageMutation.isPending || sendNotificationMutation.isPending;

  const [imagePreview, setImagePreview] = useState<string | null>(postToEdit?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      isPublic: true,
      image: undefined,
      sendNotification: false,
      notificationMessage: '',
      targetMode: 'all',
      notificationCustomType: '',
      selectedCourse: null,
      selectedUsers: []
    },
  });

  useEffect(() => {
    if (isEditing && postToEdit) {
      form.reset({
        title: postToEdit.title || '',
        content: postToEdit.content || '',
        isPublic: postToEdit.isPublic,
        image: undefined,
        sendNotification: false,
        notificationMessage: '',
        targetMode: 'all',
        notificationCustomType: '',
        selectedCourse: null,
        selectedUsers: []
      });
      setImagePreview(postToEdit.imageUrl || null);
    } else if (!isEditing) {
      form.reset({ title: '', content: '', isPublic: true, image: undefined, sendNotification: false, notificationMessage: '', notificationCustomType: '', targetMode: 'all', selectedCourse: null, selectedUsers: [] });
      setImagePreview(null);
    }
  }, [isEditing, postToEdit, form]);

  const onSubmit = (data: PostFormData) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: postToEdit!.id, data: { title: data.title, content: data.content, isPublic: data.isPublic } },
        {
          onSuccess: () => {
            if (data.image && data.image instanceof File) {
              updateImageMutation.mutate(
                { id: postToEdit!.id, image: data.image },
                {
                  onSuccess: () => {
                    toast.success(t('updateSuccess', { defaultValue: 'Post updated successfully' }));
                    onClose();
                  },
                  onError: (error) => {
                    toast.error(error.message || t('updateFailed', { defaultValue: 'Failed to update post image' }));
                    onClose(); // Still close since the text content updated successfully
                  }
                }
              );
            } else {
              toast.success(t('updateSuccess', { defaultValue: 'Post updated successfully' }));
              onClose();
            }
          },
          onError: (error) => {
            toast.error(error.message || t('updateFailed', { defaultValue: 'Failed to update post' }));
          }
        }
      );
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
            
            if (data.sendNotification) {
              const payload: any = {
                title: data.title,
                message: data.notificationMessage || '',
                type: 2,
                customType: data.notificationCustomType?.trim() || undefined,
                broadcastToAll: data.targetMode === 'all',
              };

              if (data.targetMode === 'course' && data.selectedCourse?.id) {
                payload.targetCourseId = data.selectedCourse.id;
              }
              if (data.targetMode === 'users' && data.selectedUsers?.length) {
                payload.targetUserIds = data.selectedUsers.map((u: any) => u.id);
              }

              sendNotificationMutation.mutate(
                payload,
                {
                  onSuccess: (result) => {
                    toast.success(t('notificationSentCount', { 
                      count: result.recipientCount.toString(), 
                      defaultValue: `Notification sent to ${result.recipientCount} user(s)` 
                    }));
                    onClose();
                  },
                  onError: () => {
                    toast.error(t('notificationFailed', { defaultValue: 'Failed to send notification' }));
                    onClose();
                  }
                }
              );
            } else {
              onClose();
            }
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('imageTooLarge', { defaultValue: 'Image size should not exceed 5MB' }));
        // Clear input to allow selecting another file
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
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

            {/* Image Upload */}
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

            {/* Notification Module (Only when creating) */}
            {!isEditing && (
              <div className="border-t border-black/5 pt-4 mt-2">
                <Controller
                  name="sendNotification"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3 mb-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        <span className="ms-3 font-cairo-semibold-base text-greyDarker flex items-center gap-2">
                          <Bell className="size-4 text-green-600" />
                          {t('sendNotification', { defaultValue: 'Send Notification to Users' })}
                        </span>
                      </label>
                    </div>
                  )}
                />

                {form.watch('sendNotification') && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-50 p-4 rounded-xl border border-black/5">
                    
                    {/* Custom Notification Type */}
                    <Controller
                      name="notificationCustomType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                          <label className="font-cairo-semibold-sm text-greyDarker">
                            {/* We can re-use a generic translation or add one. Assuming t('customTypeTitleLabel', { defaultValue: 'Notification Type Label' }) might not be in posts namespace, I'll provide a defaultValue */}
                            {t('customTypeLabel', { defaultValue: 'Notification Type Label (Optional)' })}
                          </label>
                          <input
                            {...field}
                            type="text"
                            placeholder={t('customTypePlaceholder', { defaultValue: 'e.g. Announcement, Alert...' })}
                            className={`${inputClasses(!!fieldState.error)} bg-white`}
                          />
                          {fieldState.error && <span className="text-red-500 text-sm font-cairo-medium-sm">{fieldState.error.message}</span>}
                        </div>
                      )}
                    />

                    {/* Notification Message Textarea */}
                    <Controller
                      name="notificationMessage"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                          <label className="font-cairo-semibold-sm text-greyDarker">
                            {t('notificationMessage', { defaultValue: 'Notification Message' })} *
                          </label>
                          <textarea
                            {...field}
                            placeholder={t('notificationMessagePlaceholder', { defaultValue: 'Enter the notification message...' })}
                            className={`${inputClasses(!!fieldState.error)} min-h-[100px] py-3 resize-y bg-white`}
                          />
                          {fieldState.error && <span className="text-red-500 text-sm font-cairo-medium-sm">{fieldState.error.message}</span>}
                        </div>
                      )}
                    />

                    <label className="font-cairo-bold-sm text-greyDark">
                      {t('target', { defaultValue: 'Send To' })}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'all' as const, icon: Users, label: t('targetAll', { defaultValue: 'All Users' }) },
                        { key: 'course' as const, icon: BookOpen, label: t('targetCourse', { defaultValue: 'Course Students' }) },
                        { key: 'users' as const, icon: UserPlus, label: t('targetUsers', { defaultValue: 'Specific Users' }) },
                      ].map(({ key, icon: Icon, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            form.setValue('targetMode', key, { shouldValidate: true });
                            if (key !== 'course') form.setValue('selectedCourse', null, { shouldValidate: true });
                            if (key !== 'users') form.setValue('selectedUsers', [], { shouldValidate: true });
                          }}
                          className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl font-cairo-bold-sm transition-all cursor-pointer border-2 ${form.watch('targetMode') === key
                            ? 'bg-blueLight/20 border-blueNormal text-blueNormal shadow-sm'
                            : 'bg-white border-transparent text-greyNormal hover:bg-white/80 border-black/5'
                            }`}
                        >
                          <Icon className="size-5" />
                          <span className="text-xs text-center leading-tight">{label}</span>
                        </button>
                      ))}
                    </div>

                    {form.watch('targetMode') === 'course' && (
                      <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="font-cairo-bold-sm text-greyDark">
                          {t('selectCourse', { defaultValue: 'Select Course' })}
                        </label>
                        <Controller
                          control={form.control}
                          name="selectedCourse"
                          render={({ field: { value, onChange } }) => (
                            <CourseSelector value={value} onChange={onChange} t={t} />
                          )}
                        />
                        {form.formState.errors.selectedCourse?.message && <p className="text-red-500 text-xs font-cairo-bold-sm">{form.formState.errors.selectedCourse.message as string}</p>}
                      </div>
                    )}

                    {form.watch('targetMode') === 'users' && (
                      <div className="flex flex-col gap-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="font-cairo-bold-sm text-greyDark">
                          {t('selectUsers', { defaultValue: 'Select Users' })}
                        </label>
                        <Controller
                          control={form.control}
                          name="selectedUsers"
                          render={({ field: { value, onChange } }) => (
                            <UserMultiSelector value={value || []} onChange={onChange} t={t} />
                          )}
                        />
                        {form.formState.errors.selectedUsers?.message && <p className="text-red-500 text-xs font-cairo-bold-sm">{form.formState.errors.selectedUsers.message as string}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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
