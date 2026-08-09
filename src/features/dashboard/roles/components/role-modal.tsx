"use client";

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { useRoleForm } from '../hooks/use-role-form';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string | null;
}

export default function RoleModal({ isOpen, onClose, roleId }: RoleModalProps) {
  const t = useTranslations('Dashboard.roles.modal');
  const tErrors = useTranslations('Dashboard.roles.errors');
  const {
    form,
    onSubmit,
    isSubmitting,
    isLoading,
    isEditing,
    allPermissions
  } = useRoleForm(roleId, onClose);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {};
    allPermissions.forEach(perm => {
      const scope = perm.split(':')[0]; // e.g. "courses" from "courses:create"
      if (!groups[scope]) groups[scope] = [];
      groups[scope].push(perm);
    });
    return groups;
  }, [allPermissions]);

  // Form submission is handled by the hook

  const inputClasses = (hasError: boolean) => `
    w-full h-12 px-4 rounded-lg border bg-white
    font-cairo-regular-base text-greyDarker
    placeholder:text-greyLightActive
    outline-none transition-colors duration-200
    ${hasError ? 'border-red-400 focus:border-red-500' : 'border-greyLightActive focus:border-blueNormal'}
  `;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h3 className="font-cairo-bold-xl text-greyDark">
            {isEditing ? t('editRole', { defaultValue: 'Edit Role' }) : t('createRole', { defaultValue: 'Create New Role' })}
          </h3>
          <button onClick={onClose} className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-greyNormal">
              <Loader2 className="size-8 animate-spin" />
              <span>{t('loading', { defaultValue: 'Loading data...' })}</span>
            </div>
          ) : (
            <form id="role-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <label className="font-cairo-semibold-base text-greyDarker">
                        {t('roleName', { defaultValue: 'Role Name' })} *
                      </label>
                      <input
                        {...field}
                        type="text"
                        placeholder={t('roleNamePlaceholder', { defaultValue: 'e.g. Content Creator' })}
                        className={inputClasses(!!fieldState.error)}
                      />
                      {fieldState.error && <span className="text-red-500 text-sm font-cairo-medium-sm">{tErrors(fieldState.error.message || 'generic')}</span>}
                    </div>
                  )}
                />

                {/* Default Role Checkbox */}
                <Controller
                  name="isDefault"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col justify-center h-full pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-5 h-5 rounded text-blueNormal focus:ring-blueNormal border-gray-300"
                        />
                        <span className="font-cairo-semibold-base text-greyDarker">
                          {t('isDefault', { defaultValue: 'Assign this role to new users automatically' })}
                        </span>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <label className="font-cairo-semibold-base text-greyDarker">
                      {t('description', { defaultValue: 'Description (Optional)' })}
                    </label>
                    <textarea
                      {...field}
                      value={field.value || ''}
                      placeholder={t('descriptionPlaceholder', { defaultValue: 'Briefly describe this role...' })}
                      className={`${inputClasses(!!fieldState.error)} min-h-[100px] py-3 resize-y`}
                    />
                  </div>
                )}
              />

              {/* Permissions */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="font-cairo-bold-lg text-greyDarker">
                    {t('permissions', { defaultValue: 'Permissions' })} *
                  </label>
                  {form.formState.errors.permissions && (
                    <span className="text-red-500 text-sm font-cairo-medium-sm">
                      {tErrors(form.formState.errors.permissions.message || 'generic')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(groupedPermissions).map(([scope, perms]) => (
                    <div key={scope} className="bg-black/5 p-4 rounded-xl border border-black/5">
                      <h4 className="font-cairo-bold-base text-blueNormal capitalize mb-4 border-b border-black/5 pb-2">
                        {scope}
                      </h4>
                      <div className="flex flex-col gap-3">
                        {perms.map(perm => (
                          <Controller
                            key={perm}
                            name="permissions"
                            control={form.control}
                            render={({ field }) => {
                              const isChecked = field.value.includes(perm);
                              return (
                                <label className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`
                                    w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors
                                    ${isChecked ? 'bg-blueNormal border-blueNormal' : 'border-gray-300 bg-white group-hover:border-blueNormal'}
                                  `}>
                                    {isChecked && (
                                      <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-white">
                                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </div>
                                  <span className="font-cairo-medium-sm text-greyDark truncate">
                                    {perm}
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      const newPerms = e.target.checked 
                                        ? [...field.value, perm]
                                        : field.value.filter(p => p !== perm);
                                      field.onChange(newPerms);
                                    }}
                                  />
                                </label>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-gray-50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-cairo-bold-base  hover:bg-red-400 transition-colors cursor-pointer bg-red-500 text-white"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="submit"
            form="role-form"
            disabled={isSubmitting || isLoading}
            className="bg-blueNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isEditing ? t('saveChanges', { defaultValue: 'Save Changes' }) : t('createRole', { defaultValue: 'Create Role' })}
          </button>
        </div>
      </div>
    </div>
  );
}
