"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil, Trash2, Plus, Filter } from 'lucide-react';
import {
  useGetAllPaymentMethodsQuery,
  useDeletePaymentMethodMutation,
} from '../hooks/use-payment-methods-api';
import { CountryPaymentMethodResponse } from '../lib/types/payment-method-types';
import { toast } from 'sonner';
import PaymentMethodModal from './payment-method-modal';
import { DeletePaymentMethodModal } from './delete-payment-method-modal';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

export default function PaymentMethodsList() {
  const t = useTranslations('Dashboard.paymentMethods');
  const { data: paymentMethods = [], isLoading, isError } =
    useGetAllPaymentMethodsQuery();
  const deleteMutation = useDeletePaymentMethodMutation();

  /* ─── Modal state ─── */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] =
    useState<CountryPaymentMethodResponse | null>(null);

  /* ─── Delete modal state ─── */
  const [deleteTarget, setDeleteTarget] =
    useState<CountryPaymentMethodResponse | null>(null);

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

  /* ─── Table columns ─── */
  const columnHelper = createColumnHelper<CountryPaymentMethodResponse>();

  const columns = useMemo(
    () => [
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
            {info.getValue()}
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
    [t]
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
                    {code}
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
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-black/5 border-b border-black/5 font-cairo-bold-base text-greyDark">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-black/5 transition-colors"
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
                ))
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

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteTarget && (
        <DeletePaymentMethodModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isDeleting={deleteMutation.isPending}
          methodTitle={deleteTarget.title}
        />
      )}
    </div>
  );
}
