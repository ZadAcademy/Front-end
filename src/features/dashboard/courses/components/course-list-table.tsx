'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { useState } from 'react';

interface CourseListTableProps {
  data: CourseApiItem[];
}

export function CourseListTable({ data }: CourseListTableProps) {
  const t = useTranslations('Dashboard.courseList');
  const tDashboard = useTranslations('Dashboard');

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatusMutation();
  const { mutate: updatePreview, isPending: isUpdatingPreview } = useUpdateCoursePreviewMutation();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourseMutation();

  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

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

  const columnHelper = createColumnHelper<CourseApiItem>();

  const columns = [
    columnHelper.accessor('imageUrl', {
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
            <div className="h-full w-full bg-gray-200"></div>
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
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orangeNormal"></div>
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
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500 border-red-200 cursor-pointer"
            onClick={() => setCourseToDelete(String(info.row.original.id))}
            disabled={isDeleting}
            title={t('actions.delete')}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4 text-red-500" />}
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="w-full bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-greyDarker uppercase bg-gray-50 border-b border-black/5 font-cairo-bold-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white border-b border-black/5 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
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
  </>
  );
}
