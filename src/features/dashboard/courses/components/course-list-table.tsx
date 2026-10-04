'use client';

import { useTranslations } from 'next-intl';
import Image from '@/shared/ui/app-image';
import Link from 'next/link';
import { Pencil, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

import { CourseApiItem } from '@/features/home/lib/types/course-card-api';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import {
  useUpdateCourseStatusMutation,
  useUpdateCoursePreviewMutation,
  useDeleteCourseMutation,
} from '../hooks/use-course-api';
import { DeleteCourseModal } from './delete-course-modal';
import { ConfirmModal } from '@/features/notifications/components/admin/confirm-modal';
import { useQueryClient } from '@tanstack/react-query';
import { deleteCourse as deleteCourseApi } from '../api/delete-course-api';
import { unwrap } from '@/shared/lib/utils/api-utils';

interface CourseListTableProps {
  data: CourseApiItem[];
}

export function CourseListTable({ data }: CourseListTableProps) {
  const t = useTranslations('Dashboard.courseList');
  const tDashboard = useTranslations('Dashboard');
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatusMutation();
  const { mutate: updatePreview, isPending: isUpdatingPreview } = useUpdateCoursePreviewMutation();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourseMutation();

  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  /* ─── Bulk delete state ─── */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  /* ─── Selection Logic ─── */
  const allSelected = data.length > 0 && data.every((item) => selectedIds.has(String(item.id)));
  const someSelected = data.some((item) => selectedIds.has(String(item.id)));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        data.forEach((item) => next.delete(String(item.id)));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        data.forEach((item) => next.add(String(item.id)));
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

  const handleStatusChange = (courseId: string, newStatusStr: string) => {
    const newStatus = Number(newStatusStr);
    updateStatus(
      { courseId, newStatus },
      {
        onSuccess: () => {
          toast.success(tDashboard('addCourse.toasts.statusUpdated'));
        },
        onError: () => {
          toast.error(tDashboard('addCourse.toasts.statusUpdateFailed'));
        },
      }
    );
  };

  const handlePreviewChange = (courseId: string, canPreview: boolean) => {
    updatePreview(
      { courseId, canPreview },
      {
        onSuccess: () => {
          toast.success(tDashboard('addCourse.toasts.previewUpdated'));
        },
        onError: () => {
          toast.error(tDashboard('addCourse.toasts.previewUpdateFailed'));
        },
      }
    );
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(
        { courseId: courseToDelete },
        {
          onSuccess: () => {
            toast.success(tDashboard('addCourse.toasts.courseDeleted'));
            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(courseToDelete);
              return next;
            });
            setCourseToDelete(null);
          },
          onError: () => {
            toast.error(tDashboard('addCourse.toasts.courseDeleteFailed'));
            setCourseToDelete(null);
          },
        }
      );
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);

    const idsToDelete = Array.from(selectedIds);
    const results = await Promise.allSettled(
      idsToDelete.map((id) => unwrap(deleteCourseApi(id)))
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    if (failed === 0) {
      toast.success(
        t('bulkDeleteSuccess', {
          defaultValue: `${succeeded} course(s) deleted successfully`,
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
        t('bulkDeleteError', { defaultValue: 'Failed to delete courses' })
      );
    }

    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setIsBulkDeleting(false);
  };

  const columnHelper = createColumnHelper<CourseApiItem>();

  const columns = useMemo(() => [
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
          checked={selectedIds.has(String(info.row.original.id))}
          onChange={() => toggleSelectOne(String(info.row.original.id))}
          className="size-4 rounded border-gray-300 text-blueNormal focus:ring-blueNormal cursor-pointer accent-[var(--color-blueNormal)]"
        />
      ),
    }),
    columnHelper.accessor('cardImageUrl', {
      header: () => t('table.image'),
      cell: (info) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-md bg-gray-100">
          {info.getValue() ? (
            <Image
              src={info.getValue() || ''}
              alt="Course cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 border border-black/5 flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-cairo-medium-sm text-center px-1">No Image</span>
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('title', {
      header: () => t('table.title'),
      cell: (info) => <span className="font-cairo-semibold-base text-greyDarker truncate block max-w-[200px]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('instructorName', {
      header: () => t('table.instructor'),
      cell: (info) => <span className="font-cairo-medium-sm text-greyNormal">{info.getValue()}</span>,
    }),
    columnHelper.accessor('price', {
      header: () => t('table.price'),
      cell: (info) => (
        <span className="font-cairo-bold-sm text-orangeNormal">
          ${info.row.original.resolvedPrice?.price ?? info.getValue() ?? 0}
        </span>
      ),
    }),
    columnHelper.accessor('level', {
      header: () => t('table.level'),
      cell: (info) => (
        <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-cairo-medium-sm text-orangeNormal">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: () => t('table.status'),
      cell: (info) => {
        const rawValue = info.getValue();
        const statusValue = rawValue !== undefined && rawValue !== null ? String(rawValue) : "2"; // Default to draft if undefined
        const statusMap: Record<string, string> = {
          "0": t('status.pending'),
          "1": t('status.published'),
          "2": t('status.draft'),
          "Pending": t('status.pending'),
          "Published": t('status.published'),
          "Draft": t('status.draft')
        };
        const displayValue = statusMap[statusValue] || statusValue;
        // Also normalize the value we pass to Select to be 0, 1, or 2 if backend returns strings
        const normalizedSelectValue = statusValue === "Pending" ? "0" : statusValue === "Published" ? "1" : statusValue === "Draft" ? "2" : statusValue;

        return (
          <Select
            value={normalizedSelectValue}
            onValueChange={(val) => handleStatusChange(String(info.row.original.id), val as string)}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="w-[120px] h-9 text-xs font-cairo-medium-sm">
              <SelectValue>{displayValue}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t('status.pending')}</SelectItem>
              <SelectItem value="1">{t('status.published')}</SelectItem>
              <SelectItem value="2">{t('status.draft')}</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    }),
    columnHelper.accessor('canPreview', {
      header: () => t('table.preview'),
      cell: (info) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!!info.getValue()}
            disabled={isUpdatingPreview}
            onChange={(e) => handlePreviewChange(String(info.row.original.id), e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-solid after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orangeNormal"></div>
        </label>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => t('table.actions'),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/courses/add?courseId=${info.row.original.id}`} passHref>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer" title={t('actions.update')}>
              <Pencil className="h-4 w-4 text-greyDark" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 border-red-300 cursor-pointer"
            onClick={() => setCourseToDelete(String(info.row.original.id))}
            disabled={isDeleting}
            title={t('actions.delete')}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4 text-red-500" />}
          </Button>
        </div>
      ),
    }),
  ], [t, tDashboard, allSelected, someSelected, selectedIds, isDeleting, isUpdatingStatus, isUpdatingPreview]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden flex flex-col">
        
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-black/5">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isRowSelected = selectedIds.has(String(row.original.id));
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-black/5 transition-colors ${
                      isRowSelected ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center font-cairo-medium-base text-greyNormal"
                >
                  {t('actions.noCourses')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    <DeleteCourseModal
      isOpen={!!courseToDelete}
      onClose={() => setCourseToDelete(null)}
      onConfirm={confirmDelete}
      isDeleting={isDeleting}
    />

    <ConfirmModal
      isOpen={isBulkDeleteModalOpen}
      onClose={() => setIsBulkDeleteModalOpen(false)}
      onConfirm={handleBulkDeleteConfirm}
      title={t('bulkDeleteTitle', { defaultValue: 'Delete Selected Courses' })}
      message={t('bulkDeleteMessage', {
        defaultValue: `Are you sure you want to delete ${selectedIds.size} course(s)? This action cannot be undone.`,
        count: selectedIds.size,
      })}
      confirmText={t('bulkDeleteConfirm', {
        defaultValue: `Delete ${selectedIds.size} Course(s)`,
        count: selectedIds.size,
      })}
      cancelText={t('cancel', { defaultValue: 'Cancel' })}
      isDestructive={true}
      isLoading={isBulkDeleting}
    />
  </>
  );
}
