"use client";

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetUsersQuery } from '../hooks/use-users-api';
import { UserWithRoles } from '../lib/types/roles-types';
import UserRolesModal from './user-roles-modal';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

export default function UsersList() {
  const t = useTranslations('Dashboard.users');
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const pageSize = 10;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const { data, isLoading, isError } = useGetUsersQuery({
    page,
    pageSize,
    search: debouncedSearch
  });

  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

  const columnHelper = createColumnHelper<UserWithRoles>();

  const columns = useMemo(
    () => [
      columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
        id: 'user',
        header: () => t('table.user', { defaultValue: 'User' }),
        cell: info => {
          const user = info.row.original;
          return (
            <div className="flex flex-col">
              <span className="font-cairo-bold-md">{user.firstName} {user.lastName}</span>
              <span className="text-sm text-greyNormal">{user.email}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('isActive', {
        header: () => t('table.status', { defaultValue: 'Status' }),
        cell: info => {
          const isActive = info.getValue();
          return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cairo-bold-sm ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isActive ? t('status.active', { defaultValue: 'Active' }) : t('status.inactive', { defaultValue: 'Inactive' })}
            </span>
          );
        },
      }),
      columnHelper.accessor('roles', {
        header: () => t('table.roles', { defaultValue: 'Assigned Roles' }),
        cell: info => {
          const roles = info.getValue();
          return (
            <div className="flex flex-wrap gap-2">
              {roles && roles.length > 0 ? (
                roles.map(role => (
                  <span key={role.id} className="bg-blueNormal/10 text-blueNormal px-2.5 py-1 rounded-md text-xs font-cairo-bold-sm">
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="text-greyNormal text-sm">{t('noRolesAssigned', { defaultValue: 'No roles' })}</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-center">{t('table.actions', { defaultValue: 'Actions' })}</div>,
        cell: info => {
          const user = info.row.original;
          return (
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedUser(user)}
                className="p-2 text-blueNormal bg-blueNormal/10 rounded-lg hover:bg-blueNormal hover:text-white transition-colors"
                title={t('actions.manageRoles', { defaultValue: 'Manage Roles' })}
              >
                <Shield className="size-4" />
              </button>
            </div>
          );
        },
      }),
    ],
    [t]
  );

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) return <div className="p-8 text-center text-red-500">{t('error', { defaultValue: 'Failed to load users' })}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cairo-bold-2xl text-greyDark">{t('title', { defaultValue: 'User Management' })}</h2>
        
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder={t('searchPlaceholder', { defaultValue: 'Search by name or email...' })}
            className="w-72 h-10 pl-10 pr-4 rounded-lg border border-black/10 bg-white font-cairo-medium-sm focus:border-blueNormal outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-greyNormal" />
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col min-h-[500px]">
        <div className="overflow-x-auto flex-1">
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
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-greyNormal">
                    {t('loading', { defaultValue: 'Loading users...' })}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-greyNormal">
                    {t('noUsers', { defaultValue: 'No users found.' })}
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
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 text-greyDark font-cairo-bold-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/10 transition-colors"
              >
                <ChevronLeft className="size-4 rtl:rotate-180" />
                <span>{t('pagination.previous', { defaultValue: 'Previous' })}</span>
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={!data.hasNextPage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 text-greyDark font-cairo-bold-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/10 transition-colors"
              >
                <span>{t('pagination.next', { defaultValue: 'Next' })}</span>
                <ChevronRight className="size-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserRolesModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}
    </div>
  );
}
