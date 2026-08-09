"use client";

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { useUserRolesForm } from '../hooks/use-user-roles-form';
import { UserWithRoles, RoleListItem } from '../lib/types/roles-types';

interface UserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRoles;
}

export default function UserRolesModal({ isOpen, onClose, user }: UserRolesModalProps) {
  const t = useTranslations('Dashboard.users.modal');
  const {
    form,
    onSubmit,
    isSubmitting,
    isLoadingRoles,
    allRoles
  } = useUserRolesForm(user, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <div className="flex flex-col">
            <h3 className="font-cairo-bold-xl text-greyDark">
              {t('title', { defaultValue: 'Manage User Roles' })}
            </h3>
            <span className="text-sm text-greyNormal font-cairo-medium-sm">
              {user.firstName} {user.lastName} ({user.email})
            </span>
          </div>
          <button onClick={onClose} className="p-2 text-greyNormal hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]">
          {isLoadingRoles ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3 text-greyNormal">
              <Loader2 className="size-6 animate-spin" />
              <span>{t('loading', { defaultValue: 'Loading roles...' })}</span>
            </div>
          ) : (
            <form id="user-roles-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <h4 className="font-cairo-bold-base text-greyDarker mb-2">
                {t('selectRoles', { defaultValue: 'Select Roles for this User' })}
              </h4>
              
              {allRoles.length === 0 ? (
                <div className="p-4 text-center text-greyNormal bg-black/5 rounded-lg">
                  {t('noRolesAvailable', { defaultValue: 'No active roles available.' })}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {allRoles.map((role: RoleListItem) => (
                    <Controller
                      key={role.id}
                      name="roles"
                      control={form.control}
                      render={({ field }) => {
                        const isChecked = field.value.includes(role.name);
                        return (
                          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors group hover:bg-black/5 border-black/10">
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
                            <span className="font-cairo-semibold-base text-greyDark">
                              {role.name}
                            </span>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isChecked}
                              onChange={(e) => {
                                const newRoles = e.target.checked 
                                  ? [...field.value, role.name]
                                  : field.value.filter(r => r !== role.name);
                                field.onChange(newRoles);
                              }}
                            />
                          </label>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-black/5 bg-gray-50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-cairo-bold-md text-greyDark hover:bg-black/5 transition-colors"
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type="submit"
            form="user-roles-form"
            disabled={isSubmitting || isLoadingRoles}
            className="bg-blueNormal text-white px-8 py-2.5 rounded-lg font-cairo-bold-md hover:bg-blueNormalHover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t('save', { defaultValue: 'Save Assignments' })}
          </button>
        </div>
      </div>
    </div>
  );
}
