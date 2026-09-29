'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Search, ArrowUpDown, Pencil, Trash2, X } from 'lucide-react';
import { AdminCertificate } from '../lib/types/admin-certificates-types';
import { useGetAdminCertificatesQuery } from '../hooks/use-admin-certificates-api';
import CertificatesPagination from './certificates-pagination';
import { useDebounce } from '@/shared/hooks/use-debounce';
import CertificateFormModal from './certificate-form-modal';
import { ConfirmModal } from '@/features/notifications/components/admin/confirm-modal';
import { deleteCertificate } from '../api/admin-certificates-api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminCertificatesList() {
  const t = useTranslations('Dashboard.certificates');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDescending, setSortDescending] = useState<boolean | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 500);

  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<AdminCertificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isError } = useGetAdminCertificatesQuery({
    Page: page,
    PageSize: pageSize,
    Search: debouncedSearch || undefined,
    SortBy: sortBy,
    SortDescending: sortDescending,
  });

  const items = useMemo(() => data?.items || [], [data?.items]);

  // Check if all visible rows are selected
  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));
  const someSelected = items.some((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      // Deselect all visible rows
      setSelectedIds((prev) => {
        const next = new Set(prev);
        items.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      // Select all visible rows
      setSelectedIds((prev) => {
        const next = new Set(prev);
        items.forEach((item) => next.add(item.id));
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

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDescending((prev) => !prev);
    } else {
      setSortBy(column);
      setSortDescending(false);
    }
    setPage(1);
  };

  const handleEdit = (certificate: AdminCertificate) => {
    setSelectedCertificate(certificate);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCertificate) return;
    setIsDeleting(true);
    try {
      await deleteCertificate(selectedCertificate.id);
      toast.success(t('deleteSuccess', { defaultValue: 'Certificate deleted successfully' }));
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      setIsDeleteModalOpen(false);
      // Remove from selection if it was selected
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(selectedCertificate.id);
        return next;
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('deleteError', { defaultValue: 'Failed to delete certificate' }));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);

    const idsToDelete = Array.from(selectedIds);
    const results = await Promise.allSettled(
      idsToDelete.map((id) => deleteCertificate(id))
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed === 0) {
      toast.success(
        t('bulkDeleteSuccess', {
          defaultValue: `${succeeded} certificate(s) deleted successfully`,
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
        t('bulkDeleteError', { defaultValue: 'Failed to delete certificates' })
      );
    }

    queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setIsDeleting(false);
  };

  const columnHelper = createColumnHelper<AdminCertificate>();

  const columns = [
    // Checkbox column
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
    columnHelper.accessor('studentName', {
      header: t('table.studentName', { defaultValue: 'Student Name' }),
      cell: (info) => (
        <span className="font-cairo-semibold-sm text-greyDark">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('code', {
      header: t('table.code', { defaultValue: 'Code' }),
      cell: (info) => (
        <span className="font-cairo-medium-sm text-greyDark font-mono">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('country', {
      header: t('table.country', { defaultValue: 'Country' }),
      cell: (info) => (
        <span className="font-cairo-medium-sm text-greyNormal">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('courseName', {
      header: t('table.courseName', { defaultValue: 'Course' }),
      cell: (info) => (
        <span className="font-cairo-medium-sm text-greyDark">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('courseNumber', {
      header: t('table.courseNumber', { defaultValue: 'Course No.' }),
      cell: (info) => (
        <span className="font-cairo-medium-sm text-greyNormal">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('date', {
      header: t('table.date', { defaultValue: 'Date' }),
      cell: (info) => (
        <span className="font-cairo-medium-sm text-greyNormal">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table.actions', { defaultValue: 'Actions' }),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-2 text-blueNormal hover:bg-blueNormal/10 rounded-lg transition-colors cursor-pointer"
            title={t('edit', { defaultValue: 'Edit' })}
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={() => {
              setSelectedCertificate(info.row.original);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title={t('delete', { defaultValue: 'Delete' })}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-black/5">
        <div>
          <h1 className="font-cairo-bold-2xl text-greyDark">{t('title', { defaultValue: 'Certificates Management' })}</h1>
          <p className="font-cairo-medium-sm text-greyNormal mt-1">
            {t('subtitle', { defaultValue: 'View and manage student certificates' })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {/* Search + Bulk Actions Bar */}
        <div className="p-5 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-[#c4c4c4]" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', { defaultValue: 'Search by name, code, course...' })}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full ps-10 pe-4 py-2 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal text-sm font-cairo-medium-sm"
            />
          </div>

          {/* Bulk action bar — appears when rows are selected */}
          {selectedIds.size > 0 && (
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
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-gray-50 border-b border-black/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.id !== 'select' && header.column.id !== 'actions' && (header.column.columnDef as any).accessorKey;
                    return (
                      <th
                        key={header.id}
                        className={`px-6 py-4 font-cairo-semibold-sm text-greyNormal whitespace-nowrap ${
                          header.column.id === 'select' ? 'w-12' : ''
                        } ${canSort ? 'cursor-pointer select-none hover:text-greyDark' : ''}`}
                        onClick={() => canSort && handleSort(String(canSort))}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <ArrowUpDown className={`size-3.5 ${sortBy === String(canSort) ? 'text-[#005b9e]' : 'text-[#c4c4c4]'}`} />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <Loader2 className="size-8 animate-spin text-blueNormal mx-auto mb-2" />
                    <span className="font-cairo-medium-sm text-greyNormal">{t('loading', { defaultValue: 'Loading certificates...' })}</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-red-500 font-cairo-medium-sm">
                    {t('error', { defaultValue: 'Failed to load certificates' })}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-greyNormal font-cairo-medium-sm">
                    {t('empty', { defaultValue: 'No certificates found' })}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isRowSelected = selectedIds.has(row.original.id);
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-black/5 transition-colors ${
                        isRowSelected
                          ? 'bg-blue-50/60 hover:bg-blue-50'
                          : 'hover:bg-gray-50'
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

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="p-5 border-t border-black/5 flex justify-center">
            <CertificatesPagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <CertificateFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        certificate={selectedCertificate}
      />

      {/* Single delete confirm */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        title={t('deleteTitle', { defaultValue: 'Delete Certificate' })}
        message={t('deleteMessage', { defaultValue: 'Are you sure you want to delete this certificate? This action cannot be undone.' })}
        confirmText={t('deleteConfirm', { defaultValue: 'Delete' })}
        isDestructive={true}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk delete confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        isLoading={isDeleting}
        title={t('bulkDeleteTitle', { defaultValue: 'Delete Selected Certificates' })}
        message={t('bulkDeleteMessage', {
          defaultValue: `Are you sure you want to delete ${selectedIds.size} certificate(s)? This action cannot be undone.`,
          count: selectedIds.size,
        })}
        confirmText={t('bulkDeleteConfirm', { 
          defaultValue: `Delete ${selectedIds.size} Certificate(s)`,
          count: selectedIds.size 
        })}
        isDestructive={true}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}
