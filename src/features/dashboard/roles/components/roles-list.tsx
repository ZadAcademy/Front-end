"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil, Power, PowerOff } from 'lucide-react';
import { useGetRolesQuery, useToggleRoleStatusMutation } from '../hooks/use-roles-api';
import { RoleListItem } from '../lib/types/roles-types';
import { toast } from 'sonner';
import RoleModal from './role-modal';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

export default function RolesList() {
  const t = useTranslations('Dashboard.roles');
  const { data: roles = [], isLoading, isError } = useGetRolesQuery(true);
  const toggleMutation = useToggleRoleStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('toasts.statusUpdated', { defaultValue: 'Role status updated successfully' }));
      },
      onError: () => {
        toast.error(t('toasts.statusUpdateFailed', { defaultValue: 'Failed to update role status' }));
      }
    });
  };

  const openCreateModal = () => {
    setEditingRoleId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (id: string) => {
    setEditingRoleId(id);
    setIsModalOpen(true);
  };

  const columnHelper = createColumnHelper<RoleListItem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => t('table.name', { defaultValue: 'Role Name' }),
        cell: info => <span className="font-cairo-medium-base">{info.getValue()}</span>,
      }),
      columnHelper.accessor('isDisabled', {
        header: () => t('table.status', { defaultValue: 'Status' }),
        cell: info => {
          const isDisabled = info.getValue();
          return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cairo-bold-sm ${
              isDisabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {isDisabled ? t('status.disabled', { defaultValue: 'Disabled' }) : t('status.active', { defaultValue: 'Active' })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-center">{t('table.actions', { defaultValue: 'Actions' })}</div>,
        cell: info => {
          const role = info.row.original;
          return (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => openEditModal(role.id)}
                className="p-2 text-blueNormal bg-blueNormal/10 rounded-lg hover:bg-blueNormal hover:text-white transition-colors"
                title={t('actions.edit', { defaultValue: 'Edit Role' })}
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => handleToggleStatus(role.id, role.isDisabled)}
                className={`p-2 rounded-lg transition-colors ${
                  role.isDisabled 
                    ? 'text-green-600 bg-green-50 hover:bg-green-600 hover:text-white' 
                    : 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white'
                }`}
                title={role.isDisabled ? t('actions.enable', { defaultValue: 'Enable' }) : t('actions.disable', { defaultValue: 'Disable' })}
                disabled={toggleMutation.isPending}
              >
                {role.isDisabled ? <Power className="size-4" /> : <PowerOff className="size-4" />}
              </button>
            </div>
          );
        },
      }),
    ],
    [t, toggleMutation.isPending] // include toggleMutation.isPending to re-render if it changes
  );

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div className="p-8 text-center text-greyNormal">{t('loading', { defaultValue: 'Loading...' })}</div>;
  if (isError) return <div className="p-8 text-center text-red-500">{t('error', { defaultValue: 'Failed to load roles' })}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('title', { defaultValue: 'Roles Management' })}</h2>
        <button
          onClick={openCreateModal}
          className="bg-blueNormal text-white px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors shadow-sm cursor-pointer"
        >
          {t('createNewRole', { defaultValue: 'Create New Role' })}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-black/5 border-b border-black/5 font-cairo-bold-base text-greyDark">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-start">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/5 font-cairo-medium-base text-greyDarker">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-greyNormal">
                    {t('noRoles', { defaultValue: 'No roles found.' })}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-black/5 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <RoleModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          roleId={editingRoleId} 
        />
      )}
    </div>
  );
}
