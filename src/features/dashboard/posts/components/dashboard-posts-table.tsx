"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Eye, EyeOff, Edit, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { useGetPostsQuery, useDeletePostMutation, useTogglePostVisibilityMutation } from '@/features/posts/hooks/use-posts-api';
import PostFormModal from '@/features/posts/components/post-form-modal';
import { Post } from '@/features/posts/lib/types/posts-types';

export default function DashboardPostsTable() {
  const t = useTranslations('Posts');
  const { data: session } = useSession();
  
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { data, isLoading, isError } = useGetPostsQuery({ page, pageSize });
  const deleteMutation = useDeletePostMutation();
  const toggleVisibilityMutation = useTogglePostVisibilityMutation();

  const permissions: string[] = (session?.user as any)?.permissions || [];
  const canCreate = permissions.includes('posts:create') || (session?.user as any)?.role === 'SuperAdmin';
  const canUpdate = permissions.includes('posts:update') || (session?.user as any)?.role === 'SuperAdmin';
  const canDelete = permissions.includes('posts:delete') || (session?.user as any)?.role === 'SuperAdmin';

  const handleCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('confirmDelete', { defaultValue: 'Are you sure you want to delete this post?' }))) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success(t('deleteSuccess', { defaultValue: 'Post deleted successfully' })),
        onError: (error) => toast.error(error.message || t('deleteFailed', { defaultValue: 'Failed to delete post' }))
      });
    }
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate(id, {
      onSuccess: () => toast.success(t('visibilitySuccess', { defaultValue: 'Visibility toggled successfully' })),
      onError: (error) => toast.error(error.message || t('visibilityFailed', { defaultValue: 'Failed to toggle visibility' }))
    });
  };

  const columnHelper = createColumnHelper<Post>();

  const columns = useMemo(() => {
    const cols: any[] = [
      columnHelper.accessor('title', {
        header: () => t('table.title', { defaultValue: 'Post Details' }),
        cell: info => {
          const post = info.row.original;
          return (
            <div className="flex items-center gap-4">
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-black/5">
                  <ImageIcon className="size-5 text-gray-300" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-cairo-bold-md text-greyDarker truncate max-w-[200px] sm:max-w-[300px]">{post.title}</span>
                <span className="text-xs text-greyNormal truncate max-w-[200px] sm:max-w-[300px]">{post.content}</span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('authorName', {
        header: () => t('table.author', { defaultValue: 'Author' }),
        cell: info => (
          <span className="font-cairo-medium-sm text-greyDark">{info.getValue() || 'User'}</span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: () => t('table.date', { defaultValue: 'Date' }),
        cell: info => (
          <span className="font-cairo-medium-sm text-greyNormal">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.accessor('isPublic', {
        header: () => t('table.status', { defaultValue: 'Visibility' }),
        cell: info => {
          const isPublic = info.getValue();
          return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-cairo-bold-sm ${
              isPublic ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {isPublic ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
              {isPublic ? t('public', { defaultValue: 'Public' }) : t('private', { defaultValue: 'Private' })}
            </span>
          );
        },
      }),
    ];

    if (canUpdate || canDelete) {
      cols.push(
        columnHelper.display({
          id: 'actions',
          header: () => <div className="text-center">{t('table.actions', { defaultValue: 'Actions' })}</div>,
          cell: info => {
            const post = info.row.original;
            return (
              <div className="flex justify-center gap-2">
                {canUpdate && (
                  <>
                    <button
                      onClick={() => handleToggleVisibility(post.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.isPublic 
                          ? 'text-green-500 bg-green-50 hover:bg-green-600 hover:text-white' 
                          : 'text-orange-500 bg-orange-50 hover:bg-orange-600 hover:text-white'
                      }`}
                      title={t('toggleVisibility', { defaultValue: 'Toggle Visibility' })}
                    >
                      {post.isPublic ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blueNormal bg-blueNormal/10 rounded-lg hover:bg-blueNormal hover:text-white transition-colors"
                      title={t('edit', { defaultValue: 'Edit Post' })}
                    >
                      <Edit className="size-4" />
                    </button>
                  </>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    title={t('delete', { defaultValue: 'Delete Post' })}
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            );
          },
        })
      );
    }

    return cols;
  }, [t, canUpdate, canDelete, toggleVisibilityMutation, deleteMutation]);

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) return <div className="p-8 text-center text-red-500">{t('error', { defaultValue: 'Failed to load posts' })}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('dashboardTitle', { defaultValue: 'Posts Management' })}</h2>
        
        {canCreate && (
          <button
            onClick={handleCreate}
            className="bg-blueNormal text-white px-6 py-2.5 rounded-lg font-cairo-bold-base hover:bg-blueNormalHover transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-5" />
            {t('createNewPost', { defaultValue: 'Create Post' })}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-start">
            <thead className="bg-black/5 border-b border-black/5 font-cairo-bold-base text-greyDark">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-start">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/5 font-cairo-medium-base text-greyDarker">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-greyNormal">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="size-5 animate-spin" />
                      {t('loading', { defaultValue: 'Loading posts...' })}
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-greyNormal">
                    {t('noPostsFound', { defaultValue: 'No posts found.' })}
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

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-black/5 flex items-center justify-between bg-gray-50">
            <span className="text-sm text-greyNormal font-cairo-medium-sm">
              {t('pagination.showing', { defaultValue: 'Showing' })} {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data.totalCount)} {t('pagination.of', { defaultValue: 'of' })} {data.totalCount}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!data.hasPreviousPage}
                className="px-4 py-2 rounded-lg bg-black/5 text-greyDark font-cairo-bold-sm disabled:opacity-50 hover:bg-black/10 transition-colors"
              >
                {t('pagination.previous', { defaultValue: 'Previous' })}
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={!data.hasNextPage}
                className="px-4 py-2 rounded-lg bg-black/5 text-greyDark font-cairo-bold-sm disabled:opacity-50 hover:bg-black/10 transition-colors"
              >
                {t('pagination.next', { defaultValue: 'Next' })}
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <PostFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postToEdit={editingPost}
        />
      )}
    </div>
  );
}
