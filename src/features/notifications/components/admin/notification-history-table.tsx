'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Trash2, Loader2, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useAdminHistoryQuery, useAdminDeleteMutation } from '../../hooks/use-admin-notifications-api';
import { AdminNotificationHistoryItem } from '../../lib/types/notification-types';
import { getNotificationTypeLabel } from '../../lib/notification-routes';
import { ConfirmModal } from './confirm-modal';
import { adminDeleteNotification } from '../../api/admin-notifications-api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function NotificationHistoryTable() {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Bulk delete state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 10;

  const { data: historyData, isLoading, isError } = useAdminHistoryQuery({
    page: currentPage,
    pageSize,
  });
  const deleteMutation = useAdminDeleteMutation();

  const history = useMemo(() => historyData?.items ?? [], [historyData?.items]);
  const totalPages = historyData?.totalPages ?? 1;

  // Selection Logic
  const allSelected = history.length > 0 && history.every((item) => selectedIds.has(item.id));
  const someSelected = history.some((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        history.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        history.forEach((item) => next.add(item.id));
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

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(
        { id: deleteId },
        { onSuccess: () => {
          setDeleteId(null);
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(deleteId);
            return next;
          });
        } }
      );
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);

    const idsToDelete = Array.from(selectedIds);
    const results = await Promise.allSettled(
      idsToDelete.map((id) => adminDeleteNotification(id))
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed === 0) {
      toast.success(
        t('bulkDeleteSuccess', {
          defaultValue: `${succeeded} notification(s) deleted successfully`,
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
        t('bulkDeleteError', { defaultValue: 'Failed to delete notifications' })
      );
    }

    queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const columnHelper = createColumnHelper<AdminNotificationHistoryItem>();

  const columns = [
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
          {getNotificationTypeLabel(info.getValue(), isRTL, info.row.original.customType)}
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/5">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-greyNormal">
                    {t('noHistory', { defaultValue: 'No notification history found.' })}
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

      {/* Single delete confirm */}
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

      {/* Bulk delete confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        title={t('bulkDeleteTitle', { defaultValue: 'Delete Selected Notifications' })}
        message={t('bulkDeleteMessage', {
          defaultValue: `Are you sure you want to delete ${selectedIds.size} notification(s)? This action cannot be undone.`,
          count: selectedIds.size,
        })}
        confirmText={t('bulkDeleteConfirm', {
          defaultValue: `Delete ${selectedIds.size} Notification(s)`,
          count: selectedIds.size,
        })}
        cancelText={t('cancel', { defaultValue: 'Cancel' })}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
