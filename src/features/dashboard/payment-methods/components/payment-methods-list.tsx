"use client";

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { COUNTRIES } from '@/shared/lib/countries';
import { Pencil, Trash2, Plus, Filter, X } from 'lucide-react';
import {
  useGetAllPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
} from '../hooks/use-payment-methods-api';
import { deletePaymentMethod } from '../api/payment-methods-api';
import { unwrap } from '@/shared/lib/utils/api-utils';
import { CountryPaymentMethodResponse } from '../lib/types/payment-method-types';
import { toast } from 'sonner';
import PaymentMethodModal from './payment-method-modal';
import { DeletePaymentMethodModal } from './delete-payment-method-modal';
import { ConfirmModal } from '@/features/notifications/components/admin/confirm-modal';
import { useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

export default function PaymentMethodsList() {
  const t = useTranslations('Dashboard.paymentMethods');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const queryClient = useQueryClient();
  
  const { data: paymentMethods = [], isLoading, isError } =
    useGetAllPaymentMethodsQuery();
  const deleteMutation = useDeletePaymentMethodMutation();

  const getCountryNameWithCode = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    return country ? `${isRTL ? country.nameAr : country.nameEn} (${code})` : code;
  };

  /* ─── Modal state ─── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] =
    useState<CountryPaymentMethodResponse | null>(null);

  /* ─── Delete modal state ─── */
  const [deleteTarget, setDeleteTarget] =
    useState<CountryPaymentMethodResponse | null>(null);

  /* ─── Bulk delete state ─── */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ─── Country filter ─── */
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const uniqueCountries = useMemo(() => {
    const codes = new Set(paymentMethods.map((m) => m.countryCode));
    return Array.from(codes).sort();
  }, [paymentMethods]);

  const filteredMethods = useMemo(() => {
    if (countryFilter === 'all') return paymentMethods;
    return paymentMethods.filter((m) => m.countryCode === countryFilter);
  }, [paymentMethods, countryFilter]);

  /* ─── Selection Logic ─── */
  const allSelected = filteredMethods.length > 0 && filteredMethods.every((item) => selectedIds.has(item.id));
  const someSelected = filteredMethods.some((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredMethods.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredMethods.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  /* ─── Handlers ─── */
  const openCreateModal = () => {
    setEditingMethod(null);
    setIsModalOpen(true);
  };

  const openEditModal = (method: CountryPaymentMethodResponse) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(
          t('toasts.deleteSuccess', {
            defaultValue: 'Payment method deleted successfully',
          })
        );
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(deleteTarget.id);
          return next;
        });
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error(
          t('toasts.deleteFailed', {
            defaultValue: 'Failed to delete payment method',
          })
        );
      },
    });
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);

    const idsToDelete = Array.from(selectedIds);
    const results = await Promise.allSettled(
      idsToDelete.map((id) => unwrap(deletePaymentMethod(id)))
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed === 0) {
      toast.success(
        t('bulkDeleteSuccess', {
          defaultValue: `${succeeded} payment method(s) deleted successfully`,
          count: succeeded,
        })
      );
    } else if (succeeded > 0) {
      toast.warning(
        t('bulkDeletePartial', {
          defaultValue: `${succeeded} deleted, ${failed} failed`,
          succeeded,
          failed,
        })
      );
    } else {
      toast.error(
        t('bulkDeleteError', { defaultValue: 'Failed to delete payment methods' })
      );
    }

    queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setIsDeleting(false);
  };

  /* ─── Table columns ─── */
  const columnHelper = createColumnHelper<CountryPaymentMethodResponse>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: () => (
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            onChange={toggleSelectAll}
            className="size-4 rounded border-gray-300 text-blueNormal focus:ring-blueNormal cursor-pointer accent-[var(--color-blueNormal)]"
          />
        ),
        cell: (info) => (
          <input
            type="checkbox"
            checked={selectedIds.has(info.row.original.id)}
            onChange={() => toggleSelectOne(info.row.original.id)}
            className="size-4 rounded border-gray-300 text-blueNormal focus:ring-blueNormal cursor-pointer accent-[var(--color-blueNormal)]"
          />
        ),
      }),
      columnHelper.display({
        id: 'logo',
        header: () => t('table.logo', { defaultValue: 'Logo' }),
        cell: (info) => {
          const method = info.row.original;
          return (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/5 border border-black/5 shrink-0">
              {method.logoUrl ? (
                <img
                  src={method.logoUrl}
                  alt={method.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-greyLightActive text-xs">
                  —
                </div>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('title', {
        header: () => t('table.title', { defaultValue: 'Title' }),
        cell: (info) => (
          <span className="font-cairo-medium-base">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('countryCode', {
        header: () => t('table.countryCode', { defaultValue: 'Country' }),
        cell: (info) => (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-cairo-bold-sm bg-blueLight/50 text-blueNormal">
            {getCountryNameWithCode(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('accountIdentifier', {
        header: () =>
          t('table.accountIdentifier', { defaultValue: 'Account / Wallet' }),
        cell: (info) => (
          <span className="font-cairo-medium-sm text-greyDarker font-mono">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => (
          <div className="text-center">
            {t('table.actions', { defaultValue: 'Actions' })}
          </div>
        ),
        cell: (info) => {
          const method = info.row.original;
          return (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => openEditModal(method)}
                className="p-2 text-blueNormal bg-blueNormal/10 rounded-lg hover:bg-blueNormal hover:text-white transition-colors cursor-pointer"
                title={t('actions.edit', { defaultValue: 'Edit' })}
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(method)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                title={t('actions.delete', { defaultValue: 'Delete' })}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    [t, allSelected, someSelected, selectedIds]
  );

  const table = useReactTable({
    data: filteredMethods,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-greyNormal">
        {t('loading', { defaultValue: 'Loading...' })}
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        {t('error', { defaultValue: 'Failed to load payment methods' })}
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-cairo-bold-2xl text-greyDark">
          {t('title', { defaultValue: 'Payment Methods' })}
        </h2>
        <div className="flex items-center gap-3">
          {/* Country filter */}
          {uniqueCountries.length > 1 && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-greyLightActive pointer-events-none" />
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="h-10 pl-9 pr-4 rounded-lg border border-black/5 bg-white font-cairo-medium-sm text-greyDarker outline-none focus:border-blueNormal transition-colors appearance-none cursor-pointer"
              >
                <option value="all">
                  {t('filter.all', { defaultValue: 'All Countries' })}
                </option>
                {uniqueCountries.map((code) => (
                  <option key={code} value={code}>
                    {getCountryNameWithCode(code)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={openCreateModal}
            className="bg-blueNormal text-white px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Plus className="size-5" />
            {t('addNew', { defaultValue: 'Add Payment Method' })}
          </button>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        
        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div className="p-5 border-b border-black/5 flex justify-end">
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <span className="font-cairo-semibold-sm text-red-700">
                {selectedIds.size} {t('selected', { defaultValue: 'selected' })}
              </span>
              <button
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg font-cairo-semibold-sm hover:bg-red-700 transition-colors cursor-pointer text-sm"
              >
                <Trash2 className="size-3.5" />
                {t('deleteSelected', { defaultValue: 'Delete Selected' })}
              </button>
              <button
                onClick={clearSelection}
                className="p-1 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                title={t('clearSelection', { defaultValue: 'Clear selection' })}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-gray-50 border-b border-black/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={`px-6 py-4 text-start font-cairo-semibold-sm text-greyNormal whitespace-nowrap ${header.id === 'select' ? 'w-12' : ''}`}>
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
            <tbody className="divide-y divide-black/5">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-greyNormal"
                  >
                    {t('noMethods', {
                      defaultValue: 'No payment methods found.',
                    })}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isRowSelected = selectedIds.has(row.original.id);
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-black/5 transition-colors ${
                        isRowSelected ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create / Edit Modal ─── */}
      {isModalOpen && (
        <PaymentMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingMethod={editingMethod}
        />
      )}

      {/* ─── Single Delete Confirmation Modal ─── */}
      {deleteTarget && (
        <DeletePaymentMethodModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isDeleting={deleteMutation.isPending}
          methodTitle={deleteTarget.title}
        />
      )}

      {/* ─── Bulk Delete Confirmation Modal ─── */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title={t('bulkDeleteTitle', { defaultValue: 'Delete Selected Payment Methods' })}
        message={t('bulkDeleteMessage', {
          defaultValue: `Are you sure you want to delete ${selectedIds.size} payment method(s)? This action cannot be undone.`,
          count: selectedIds.size,
        })}
        confirmText={t('bulkDeleteConfirm', {
          defaultValue: `Delete ${selectedIds.size} Payment Method(s)`,
          count: selectedIds.size,
        })}
        cancelText={t('modal.cancel', { defaultValue: 'Cancel' })}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
