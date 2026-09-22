'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Trash2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAdminHistoryQuery, useAdminDeleteMutation } from '../../hooks/use-admin-notifications-api';
import { AdminNotificationHistoryItem } from '../../lib/types/notification-types';
import { getNotificationTypeLabel } from '../../lib/notification-routes';
import { ConfirmModal } from './confirm-modal';

export default function NotificationHistoryTable() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const { data: historyData, isLoading, isError } = useAdminHistoryQuery({
    page: currentPage,
    pageSize,
  });
  const deleteMutation = useAdminDeleteMutation();

  const history = historyData?.items ?? [];
  const totalPages = historyData?.totalPages ?? 1;

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(
        { id: deleteId },
        { onSuccess: () => setDeleteId(null) }
      );
    }
  };

  const columnHelper = createColumnHelper<AdminNotificationHistoryItem>();

  const columns = [
    columnHelper.accessor('title', {
      header: () => t('tableTitle', { defaultValue: 'Title' }),
      cell: (info) => (
        <span className="font-cairo-medium-base text-greyDark max-w-[200px] truncate block" title={info.getValue()}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('type', {
      header: () => t('tableType', { defaultValue: 'Type' }),
      cell: (info) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-cairo-bold-sm bg-blueLight/50 text-blueNormal">
          {getNotificationTypeLabel(info.getValue(), isRTL)}
        </span>
      ),
    }),
    columnHelper.accessor('recipientCount', {
      header: () => t('tableRecipients', { defaultValue: 'Recipients' }),
      cell: (info) => (
        <span className="font-cairo-bold-base text-greyDark">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('sentAt', {
      header: () => t('tableSentAt', { defaultValue: 'Sent At' }),
      cell: (info) => {
        const date = new Date(info.getValue());
        return (
          <span className="font-cairo-medium-sm text-greyNormal">
            {date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-center">{t('tableActions', { defaultValue: 'Actions' })}</div>,
      cell: (info) => {
        const item = info.row.original;
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deleteMutation.isPending}
              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white
                         transition-colors cursor-pointer border-none disabled:opacity-50"
              title={t('delete', { defaultValue: 'Delete' })}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: history,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="size-8 text-blueNormal animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500 font-cairo-medium-base">
        {t('historyError', { defaultValue: 'Failed to load notification history.' })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-black/5 border-b border-black/5 font-cairo-bold-base text-greyDark">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-start whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/5 font-cairo-medium-base text-greyDarker">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-greyNormal">
                    {t('noHistory', { defaultValue: 'No notification history found.' })}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-black/5 transition-colors">
                    {row.getVisibleCells().map((cell) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5
                       font-cairo-medium-sm text-greyDark hover:bg-black/5 transition-colors
                       cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRTL ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
            {t('prev', { defaultValue: 'Previous' })}
          </button>
          <span className="font-cairo-bold-sm text-greyDark">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5
                       font-cairo-medium-sm text-greyDark hover:bg-black/5 transition-colors
                       cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('next', { defaultValue: 'Next' })}
            {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title={t('delete', { defaultValue: 'Delete' })}
        message={t('confirmDelete', { defaultValue: 'Are you sure you want to delete this notification batch for all users?' })}
        confirmText={t('delete', { defaultValue: 'Delete' })}
        cancelText={t('cancel', { defaultValue: 'Cancel' })}
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
